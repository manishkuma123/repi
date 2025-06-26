import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { eAPIResultStatus } from 'src/utils/enum';
import * as Omise from 'omise';
import {CustomerCashWallet, CustomerCashWalletDocument} from 'src/entitites/customer-cash-wallet';
import {CustomerPointWallet, CustomerPointWalletDocument} from 'src/entitites/customer-point-wallet';
import {OmiseCharge, OmiseChargeDocument} from 'src/entitites/omise-charge';
import { ScheduledJob, ScheduledJobDocument } from 'src/entitites/scheduled-job';

import { ConfigurationService } from '../configuration/configuration.service';

@Injectable()
export class CustomerWalletService {

	private omise: any;
  	private omiseSecret: any;

  	constructor(
  		@InjectModel(CustomerCashWallet.name)
	    private customerCashWalletModel: Model<CustomerCashWalletDocument>,

	    @InjectModel(CustomerPointWallet.name)
	    private customerPointWalletModel: Model<CustomerPointWalletDocument>,

	    @InjectModel(OmiseCharge.name)
    	private omiseChargeModel: Model<OmiseChargeDocument>,

	    @InjectModel(ScheduledJob.name)
    	private scheduledJobModel: Model<ScheduledJobDocument>,

    	private readonly configurationService: ConfigurationService,
  	){
  		this.omiseSecret = process.env.OMISE_SECRET_KEY?.replace(/^"(.*)"$/, '$1');

	    console.log('OMISE_SECRET_KEY:', this.omiseSecret);
	    this.omise = Omise({
	      secretKey: this.omiseSecret
	    });  	    
  	}

  	// Credit and On Hold amount and points to wallet
  	async creditedToWallet(customer_id: string, omise_charges_id: string, scheduled_job_id: string, amount: number, points: number): Promise<any> {

  		try {

  			const scheduledJob: any = await this.scheduledJobModel.findById(scheduled_job_id);
  			const configuration:any = await this.configurationService.getConfiguration();
  			const configData:any = configuration.data;

  			const orderNumber = scheduledJob?.order_number;

  			// Credited to wallet entry 
	  		const createdCreditEntry = new this.customerCashWalletModel({
		        "customer_id": customer_id,
		        "omise_charges_id": omise_charges_id,
		        "scheduled_job_id": scheduled_job_id,
		        "amount": amount,
		        "type": "Credited",
		        "status": "Credited to wallet",
		        "description": "Pay",
		        "transaction_date": Date.now()
		    });

		    const creditResponse = await createdCreditEntry.save();
	    
		    // On Hold to wallet entry 
	  		const createdDebitEntry = new this.customerCashWalletModel({
		        "customer_id": customer_id,
		        "omise_charges_id": omise_charges_id,
		        "scheduled_job_id": scheduled_job_id,
		        "amount": amount,
		        "type": "Debited",
		        "status": "On Hold",
		        "description": "On Hold",
		        "transaction_date": Date.now()
		    });

		    const debitResponse = await createdDebitEntry.save();

		    if(points > 0){
		    	// On Hold to point wallet entry 
		  		const createdDebitPointEntry = new this.customerPointWalletModel({
			        "customer_id": customer_id,
			        "omise_charges_id": omise_charges_id,
			        "scheduled_job_id": scheduled_job_id,
			        "point": points,
			        "type": "Debited",
			        "status": "On Hold",
			        "description": "On Hold",
			        "transaction_date": Date.now()
			    });

			    const debitPointResponse = await createdDebitPointEntry.save();
		    }

		    return { status: eAPIResultStatus.Success };

		} catch (error) {
	      console.error('Error creating wallet:', error);
	      return { status: eAPIResultStatus.Failure };
	    }
  	}

  	// Customer cancel booking before 48 hours
  	async cancelsBefore48Hours(customer_id: string, scheduled_job_id: string): Promise<any> {

  		try {

  			const scheduledJob: any = await this.scheduledJobModel.findById(scheduled_job_id);
  			console.log(scheduledJob)

  			const orderNumber = scheduledJob?.order_number;

  			const omiseCharge = await this.omiseChargeModel
		      .findOne({
		        scheduled_job_id: '' + scheduled_job_id,
		        payment_status: 'completed',
		    });

		    if (!omiseCharge) {
		        return { status: eAPIResultStatus.Failure, notFound: true };
		    }

		    // Refund Charge
		    const refundAmount = ((omiseCharge.price * 95) / 100);
		    const cancellationFees = ((omiseCharge.price * 5) / 100);
		   

		    const refundResponse = await this.refundCharge(refundAmount, omiseCharge?.charge_id);
		    console.log(refundResponse)

		    await this.customerCashWalletModel.updateOne(
		        { scheduled_job_id: scheduled_job_id, status: 'On Hold' },
		        { $set: { status: 'Refunded', amount: refundAmount, description:'Refunded'} },
		    );		      
	    
		    // Cancellation fees wallet entry 
	  		const cancellationFeesEntry = new this.customerCashWalletModel({
		        "customer_id": customer_id,
		        "omise_charges_id": '',
		        "scheduled_job_id": scheduled_job_id,
		        "amount": cancellationFees,
		        "type": "Debited",
		        "status": "Completed",
		        "description": "Cancellation Fee",
		        "transaction_date": Date.now()
		    });

		    const cancellationResponse = await cancellationFeesEntry.save();

		    if(omiseCharge?.points > 0){

		    	// Refund Points
			    const refundPoints = ((omiseCharge?.points * 95) / 100);
			    const cancellationFeesPoints = ((omiseCharge?.points * 5) / 100);

			    await this.customerPointWalletModel.updateOne(
			        { scheduled_job_id: scheduled_job_id, status: 'On Hold' },
			        { $set: { status: 'Refunded', point: refundPoints, description:'Refunded'} },
			    );	

		    	// Cancellation fees point wallet entry 
		  		const createdDebitPointEntry = new this.customerPointWalletModel({
			        "customer_id": customer_id,
			        "omise_charges_id": '',
			        "scheduled_job_id": scheduled_job_id,
			        "point": cancellationFeesPoints,
			        "type": "Debited",
			        "status": "Completed",
			        "description": "Cancellation Fee",
			        "transaction_date": Date.now()
			    });
			    const cancellationPointResponse = await createdDebitPointEntry.save();
		    }

		    return { status: eAPIResultStatus.Success };
		    
		} catch (error) {
	      console.error('Error cancellation before 48 hours wallet:', error);
	      return { status: eAPIResultStatus.Failure };
	    }
  	}

  	// Customer cancel booking within 48 hours
  	async cancelsWithin48Hours(customer_id: string, scheduled_job_id: string): Promise<any> {

  		try {

  			const scheduledJob: any = await this.scheduledJobModel.findById(scheduled_job_id);
  			console.log(scheduledJob)

  			const orderNumber = scheduledJob?.order_number;

  			const omiseCharge = await this.omiseChargeModel
		      .findOne({
		        scheduled_job_id: '' + scheduled_job_id,
		        payment_status: 'completed',
		    });

		    if (!omiseCharge) {
		        return { status: eAPIResultStatus.Failure, notFound: true };
		    }

		    // Refund Charge
		    const refundAmount = ((omiseCharge.price * 50) / 100);
		    const cancellationFees = ((omiseCharge.price * 50) / 100);

		    const refundResponse = await this.refundCharge(refundAmount, omiseCharge?.charge_id);
		    console.log(refundResponse)

		    await this.customerCashWalletModel.updateOne(
		        { scheduled_job_id: scheduled_job_id, status: 'On Hold' },
		        { $set: { status: 'Refunded', amount: refundAmount, description:'Refunded'} },
		    );		      
	    
		    // Cancellation fees wallet entry 
	  		const cancellationFeesEntry = new this.customerCashWalletModel({
		        "customer_id": customer_id,
		        "omise_charges_id": '',
		        "scheduled_job_id": scheduled_job_id,
		        "amount": cancellationFees,
		        "type": "Debited",
		        "status": "Completed",
		        "description": "Cancellation Fee",
		        "transaction_date": Date.now()
		    });

		    const cancellationResponse = await cancellationFeesEntry.save();

		    if(omiseCharge?.points > 0){

		    	// Refund Points
			    const refundPoints = ((omiseCharge?.points * 50) / 100);
			    const cancellationFeesPoints = ((omiseCharge?.points * 50) / 100);

			    await this.customerPointWalletModel.updateOne(
			        { scheduled_job_id: scheduled_job_id, status: 'On Hold' },
			        { $set: { status: 'Refunded', point: refundPoints, description:'Refunded'} },
			    );	

		    	// Cancellation fees point wallet entry 
		  		const createdDebitPointEntry = new this.customerPointWalletModel({
			        "customer_id": customer_id,
			        "omise_charges_id": '',
			        "scheduled_job_id": scheduled_job_id,
			        "point": cancellationFeesPoints,
			        "type": "Debited",
			        "status": "Completed",
			        "description": "Cancellation Fee",
			        "transaction_date": Date.now()
			    });
			    const cancellationPointResponse = await createdDebitPointEntry.save();
		    }

		    return { status: eAPIResultStatus.Success };
		    
		} catch (error) {
	      console.error('Error cancellation within 48 hours wallet:', error);
	      return { status: eAPIResultStatus.Failure };
	    }
  	}

  	// Helper cancel booking
  	async helperCancelsBooking(customer_id: string, scheduled_job_id: string): Promise<any> {

  		try {

  			const scheduledJob: any = await this.scheduledJobModel.findById(scheduled_job_id);
  			console.log(scheduledJob)

  			const orderNumber = scheduledJob?.order_number;

  			const omiseCharge = await this.omiseChargeModel
		      .findOne({
		        scheduled_job_id: '' + scheduled_job_id,
		        payment_status: 'completed',
		    });

		    if (!omiseCharge) {
		        return { status: eAPIResultStatus.Failure, notFound: true };
		    }

		    // Refund Charge
		    const refundAmount = omiseCharge.price;

		    const refundResponse = await this.refundCharge(refundAmount, omiseCharge?.charge_id);
		    console.log(refundResponse)

		    await this.customerCashWalletModel.updateOne(
		        { scheduled_job_id: scheduled_job_id, status: 'On Hold' },
		        { $set: { status: 'Refunded', amount: refundAmount, description:'Refunded'} },
		    );		      
	    
		    if(omiseCharge?.points > 0){

		    	// Refund Points
			    const refundPoints = omiseCharge?.points;

			    await this.customerPointWalletModel.updateOne(
			        { scheduled_job_id: scheduled_job_id, status: 'On Hold' },
			        { $set: { status: 'Refunded', point: refundPoints, description:'Refunded'} },
			    );	
		    }

		    return { status: eAPIResultStatus.Success };
		    
		} catch (error) {
	      console.error('Error helper cancellation wallet:', error);
	      return { status: eAPIResultStatus.Failure };
	    }
  	}

  	// Customer No-Show policy
  	async customerNoShowPolicy(customer_id: string, scheduled_job_id: string): Promise<any> {

  		try {

  			const scheduledJob: any = await this.scheduledJobModel.findById(scheduled_job_id);
  			console.log(scheduledJob)

  			const orderNumber = scheduledJob?.order_number;

  			const omiseCharge = await this.omiseChargeModel
		      .findOne({
		        scheduled_job_id: '' + scheduled_job_id,
		        payment_status: 'completed',
		    });

		    if (!omiseCharge) {
		        return { status: eAPIResultStatus.Failure, notFound: true };
		    }

		    // Refund Charge
		    const refundAmount = ((omiseCharge.price * 50) / 100);
		    const noShowFees = ((omiseCharge.price * 50) / 100);

		    const refundResponse = await this.refundCharge(refundAmount, omiseCharge?.charge_id);
		    console.log(refundResponse)

		    await this.customerCashWalletModel.updateOne(
		        { scheduled_job_id: scheduled_job_id, status: 'On Hold' },
		        { $set: { status: 'Refunded', amount: refundAmount, description:'Refunded'} },
		    );		      
	    
		    // Cancellation fees wallet entry 
	  		const noShowFeesEntry = new this.customerCashWalletModel({
		        "customer_id": customer_id,
		        "omise_charges_id": '',
		        "scheduled_job_id": scheduled_job_id,
		        "amount": noShowFees,
		        "type": "Debited",
		        "status": "Completed",
		        "description": "No-Show Fee",
		        "transaction_date": Date.now()
		    });

		    const noShowResponse = await noShowFeesEntry.save();

		    if(omiseCharge?.points > 0){

		    	// Refund Points
			    const refundPoints = ((omiseCharge?.points * 50) / 100);
			    const noShowFeesPoints = ((omiseCharge?.points * 50) / 100);

			    await this.customerPointWalletModel.updateOne(
			        { scheduled_job_id: scheduled_job_id, status: 'On Hold' },
			        { $set: { status: 'Refunded', point: refundPoints, description:'Refunded'} },
			    );	

		    	// Cancellation fees point wallet entry 
		  		const createdDebitPointEntry = new this.customerPointWalletModel({
			        "customer_id": customer_id,
			        "omise_charges_id": '',
			        "scheduled_job_id": scheduled_job_id,
			        "point": noShowFeesPoints,
			        "type": "Debited",
			        "status": "Completed",
			        "description": "No-Show Fee",
			        "transaction_date": Date.now()
			    });
			    const cancellationPointResponse = await createdDebitPointEntry.save();
		    }

		    return { status: eAPIResultStatus.Success };
		    
		} catch (error) {
	      console.error('Error customer no show policy wallet:', error);
	      return { status: eAPIResultStatus.Failure };
	    }
  	}

  	// Helper No-Show policy
  	async helperNoShowPolicy(customer_id: string, scheduled_job_id: string): Promise<any> {

  		try {

  			const scheduledJob: any = await this.scheduledJobModel.findById(scheduled_job_id);
  			console.log(scheduledJob)

  			const orderNumber = scheduledJob?.order_number;

  			const omiseCharge = await this.omiseChargeModel
		      .findOne({
		        scheduled_job_id: '' + scheduled_job_id,
		        payment_status: 'completed',
		    });

		    if (!omiseCharge) {
		        return { status: eAPIResultStatus.Failure, notFound: true };
		    }

		    // Refund Charge
		    const refundAmount = omiseCharge.price;

		    const refundResponse = await this.refundCharge(refundAmount, omiseCharge?.charge_id);
		    console.log(refundResponse)
		    
		    await this.customerCashWalletModel.updateOne(
		        { scheduled_job_id: scheduled_job_id, status: 'On Hold' },
		        { $set: { status: 'Refunded', amount: refundAmount, description:'Refunded'} },
		    );		      
	    
		    if(omiseCharge?.points > 0){

		    	// Refund Points
			    const refundPoints = omiseCharge?.points;

			    await this.customerPointWalletModel.updateOne(
			        { scheduled_job_id: scheduled_job_id, status: 'On Hold' },
			        { $set: { status: 'Refunded', point: refundPoints, description:'Refunded'} },
			    );	
		    }

		    return { status: eAPIResultStatus.Success };
		    
		} catch (error) {
	      console.error('Error helper no show policy wallet:', error);
	      return { status: eAPIResultStatus.Failure };
	    }
  	}

  	// Order completed
  	async orderCompleted(customer_id: string, scheduled_job_id: string): Promise<any> {

  		try {

  			const scheduledJob: any = await this.scheduledJobModel.findById(scheduled_job_id);
  			console.log(scheduledJob)

  			const orderNumber = scheduledJob?.order_number;

		    const omiseCharge = await this.omiseChargeModel
		      .findOne({
		        scheduled_job_id: '' + scheduled_job_id,
		        payment_status: 'completed',
		    });

		    if (!omiseCharge) {
		        return { status: eAPIResultStatus.Failure, notFound: true };
		    }
		
		    await this.customerCashWalletModel.updateOne(
		        { scheduled_job_id: scheduled_job_id, status: 'On Hold' },
		        { $set: { status: 'Completed', description:'Pay'} },
		    );		      
	    
		    if(omiseCharge?.points > 0){

			    await this.customerPointWalletModel.updateOne(
			        { scheduled_job_id: scheduled_job_id, status: 'On Hold' },
			        { $set: { status: 'Completed', description:'Pay'} },
			    );	
		    }

		    return { status: eAPIResultStatus.Success };
		    
		} catch (error) {
	      console.error('Error order completed wallet:', error);
	      return { status: eAPIResultStatus.Failure };
	    }
  	}

  	async refundCharge(amount: number, chargeId: string) {
	    try {	    	
	    	let refundAmount = amount * 100;
	      	
	      	const refund = await this.omise.charges.createRefund(chargeId, {
			  amount: refundAmount, // optional, full refund if omitted
			});

	      	return refund;
	    } catch (error) {
	    	console.log("Refund error :",error);
	      	throw new Error('Failed to refund');
	    }
	}

	// Get customer case wallet
	async getCustomerCaseWallet(customer_id: string, page: number): Promise<any> {

  		try {

  			const pageNumber = page || 1;
			const limit = 10;
			const skip = (pageNumber - 1) * limit;

		    const caseWalletEntry = await this.customerCashWalletModel
		      	.find({customer_id: '' + customer_id})
		    	.sort({ transaction_date: -1 })
		    	.skip(skip)
  				.limit(limit)
		    	.populate([
		    		{ 
		    			path: 'scheduled_job_id', 
		    			populate: [
		    				{ 
		    					path: 'job_id',
		    					select: 'site_details start_date',
		    					populate: [
		    						{path: 'sub_job_id', select: 'sub_job_name'}
		    					]
		    				}
		    			] 
		    		}
		    	])
          		.exec();

          	const totalRecord = await this.customerCashWalletModel.countDocuments({
			  customer_id: '' + customer_id,
			});        	

		    if (!caseWalletEntry) {
		        return { status: eAPIResultStatus.Failure, data: [] };
		    }
		
			const availableBalance = await this.calculateCustomerAvailableBalance(customer_id);
			const onHoldBalance = await this.calculateCustomerOnHoldBalance(customer_id);
			const availablePoints = await this.calculateCustomerAvailablePointsBalance(customer_id);
			const onHoldPoints = await this.calculateCustomerOnHoldPointsBalance(customer_id);
		
		    const meta = { 
		    	"currentPage": pageNumber,			    
			    "totalPages": Math.ceil(totalRecord / limit),
			    "availableBalance": (availableBalance - onHoldBalance),
			    "onHoldBalance": onHoldBalance,
			    "availablePoints": (availablePoints - onHoldPoints),
			};


		    return { status: eAPIResultStatus.Success, data:caseWalletEntry, meta:meta };
		    
		} catch (error) {
	      console.error('Error case wallet:', error);
	      return { status: eAPIResultStatus.Failure, data: [] };
	    }
  	}

  	// Get customer received point wallet
  	async getCustomerReceivedPointWallet(customer_id: string, page: number): Promise<any> {

  		try {

  			const pageNumber = page || 1;
			const limit = 10;
			const skip = (pageNumber - 1) * limit;

		    const pointWalletEntry = await this.customerPointWalletModel
		      	.find({customer_id: '' + customer_id, type: 'Credited'})
		    	.sort({ transaction_date: -1 })
		    	.skip(skip)
  				.limit(limit)
		    	.populate([
		    		{ 
		    			path: 'scheduled_job_id', 
		    			populate: [
		    				{ 
		    					path: 'job_id',
		    					select: 'site_details start_date',
		    					populate: [
		    						{path: 'sub_job_id', select: 'sub_job_name'}
		    					]
		    				}
		    			] 
		    		}
		    	])
          		.exec();
          	
          	const totalRecord = await this.customerPointWalletModel.countDocuments({
			  	customer_id: '' + customer_id,
			  	type: 'Credited'
			});  

		    if (!pointWalletEntry) {
		        return { status: eAPIResultStatus.Failure, data: [] };
		    }

		    const availablePoints = await this.calculateCustomerAvailablePointsBalance(customer_id);
		    const onHoldPoints = await this.calculateCustomerOnHoldPointsBalance(customer_id);
			
			const meta = { 
		    	"currentPage": pageNumber,			    
			    "totalPages": Math.ceil(totalRecord / limit),
			    "availablePoints": (availablePoints - onHoldPoints),
			    "onHoldPoints": onHoldPoints,
			};

		    return { status: eAPIResultStatus.Success, data:pointWalletEntry, meta:meta  };
		    
		} catch (error) {
	      console.error('Error point wallet:', error);
	      return { status: eAPIResultStatus.Failure, data: [] };
	    }
  	}

  	// Get customer used point wallet
  	async getCustomerUsedPointWallet(customer_id: string, page: number): Promise<any> {

  		try {

  			const pageNumber = page || 1;
			const limit = 10;
			const skip = (pageNumber - 1) * limit;

		    const pointWalletEntry = await this.customerPointWalletModel
		      	.find({customer_id: '' + customer_id, type: 'Debited', status: { $in: ['Completed', 'Refunded', 'On Hold'] }})
		    	.sort({ transaction_date: -1 })
		    	.skip(skip)
  				.limit(limit)
		    	.populate([
		    		{ 
		    			path: 'scheduled_job_id', 
		    			populate: [
		    				{ 
		    					path: 'job_id',
		    					select: 'site_details start_date',
		    					populate: [
		    						{path: 'sub_job_id', select: 'sub_job_name'}
		    					]
		    				}
		    			] 
		    		}
		    	])
          		.exec();
          	
          	const totalRecord = await this.customerPointWalletModel.countDocuments({
			  	customer_id: '' + customer_id,
			  	type: 'Debited',
			  	status: { $in: ['Completed', 'Refunded', 'On Hold'] }
			});  

		    if (!pointWalletEntry) {
		        return { status: eAPIResultStatus.Failure, data: [] };
		    }

		    const availablePoints = await this.calculateCustomerAvailablePointsBalance(customer_id);
		    const onHoldPoints = await this.calculateCustomerOnHoldPointsBalance(customer_id);
			
			const meta = { 
		    	"currentPage": pageNumber,			    
			    "totalPages": Math.ceil(totalRecord / limit),
			    "availablePoints": (availablePoints - onHoldPoints),
			    "onHoldPoints": onHoldPoints,
			};

		    return { status: eAPIResultStatus.Success, data:pointWalletEntry, meta:meta  };
		    
		} catch (error) {
	      console.error('Error point wallet:', error);
	      return { status: eAPIResultStatus.Failure, data: [] };
	    }
  	}

  	// Distribute Promotional Points
  	async distributePromotionalPoints(customer_id: string, point: number, description: string): Promise<any> {

  		try {

		    if(point > 0){

		    	const configuration:any = await this.configurationService.getConfiguration();
  				const configData:any = configuration.data;
  				const expirationDays = parseInt(configData?.COIN_EXPIRATION_TIME);

  				const currentDate = new Date();
				const expirationDate = new Date(currentDate.getTime() + expirationDays * 24 * 60 * 60 * 1000);
		    	
		  		const createdPointEntry = new this.customerPointWalletModel({
			        "customer_id": customer_id,
			        "omise_charges_id": null,
			        "scheduled_job_id": null,
			        "point": point,
			        "type": "Credited",
			        "status": "Completed",
			        "description": description,
			        "expiration_date": expirationDate,
			        "transaction_date": Date.now()
			    });

			    const pointResponse = await createdPointEntry.save();
		    }

		    return { status: eAPIResultStatus.Success };
		    
		} catch (error) {
	      console.error('Error distribute promotional point:', error);
	      return { status: eAPIResultStatus.Failure };
	    }
  	}

  	// Get customer available points
  	async getCustomerAvailablePoints(customer_id: string): Promise<any> {

  		try {

		    const credited = await this.customerPointWalletModel.aggregate([
		      	{ $match: { customer_id: customer_id, type: 'Credited', status: 'Completed' } },
		      	{ $group: { _id: null, total: { $sum: '$point' } } }
		    ]);

			const debited = await this.customerPointWalletModel.aggregate([
  				{ $match: { customer_id: customer_id, type: 'Debited', status: { $in: ['Completed', 'Refunded'] } } },
  				{ $group: { _id: null, total: { $sum: '$point' } } }
			]);

    		const totalCredited = credited[0]?.total || 0;
    		const totalDebited = debited[0]?.total || 0;

    		const balancedPoints =  totalCredited - totalDebited;
    		const onHoldPoints = await this.calculateCustomerOnHoldPointsBalance(customer_id);

    		const availablePoints = (balancedPoints - onHoldPoints);

		    return { status: eAPIResultStatus.Success, points: availablePoints };
		    
		} catch (error) {
	      console.error('Error distribute promotional point:', error);
	      return { status: eAPIResultStatus.Failure };
	    }
  	}

  	/*============================= Custom Function ==============================*/

  	// Calculate available balance
  	async calculateCustomerAvailableBalance(customer_id: string): Promise<any> {

  		try {

		    const credited = await this.customerCashWalletModel.aggregate([
		      	{ $match: { customer_id: customer_id, type: 'Credited', status: 'Credited to wallet' } },
		      	{ $group: { _id: null, total: { $sum: '$amount' } } }
		    ]);

			const debited = await this.customerCashWalletModel.aggregate([
  				{ $match: { customer_id: customer_id, type: 'Debited', status: { $in: ['Completed', 'Refunded'] } } },
  				{ $group: { _id: null, total: { $sum: '$amount' } } }
			]);

    		const totalCredited = credited[0]?.total || 0;
    		const totalDebited = debited[0]?.total || 0;

    		const availableBalance =  totalCredited - totalDebited;

		    return availableBalance;
		    
		} catch (error) {
	      console.error('Error calculate available balance:', error);
	      return 0;
	    }
  	}

  	// Calculate onhold balance
  	async calculateCustomerOnHoldBalance(customer_id: string): Promise<any> {

  		try {

		    const onHold = await this.customerCashWalletModel.aggregate([
		      	{ $match: { customer_id: customer_id, type: 'Debited', status: 'On Hold' } },
		      	{ $group: { _id: null, total: { $sum: '$amount' } } }
		    ]);

    		const totalOnHold = onHold[0]?.total || 0;

		    return totalOnHold;
		    
		} catch (error) {
	      console.error('Error calculate on hold balance:', error);
	      return 0;
	    }
  	}

  	// Calculate available points balance
  	async calculateCustomerAvailablePointsBalance(customer_id: string): Promise<any> {

  		try {

		    const credited = await this.customerPointWalletModel.aggregate([
		      	{ $match: { customer_id: customer_id, type: 'Credited', status: 'Completed' } },
		      	{ $group: { _id: null, total: { $sum: '$point' } } }
		    ]);

			const debited = await this.customerPointWalletModel.aggregate([
  				{ $match: { customer_id: customer_id, type: 'Debited', status: { $in: ['Completed', 'Refunded'] } } },
  				{ $group: { _id: null, total: { $sum: '$point' } } }
			]);

    		const totalCredited = credited[0]?.total || 0;
    		const totalDebited = debited[0]?.total || 0;

    		const balancedPoints =  totalCredited - totalDebited;

		    return balancedPoints;
		    
		} catch (error) {
	      console.error('Error calculate point balance:', error);
	      return 0;
	    }
  	}

  	// Calculate available points balance
  	async calculateCustomerOnHoldPointsBalance(customer_id: string): Promise<any> {

  		try {

  			const onHold = await this.customerPointWalletModel.aggregate([
		      	{ $match: { customer_id: customer_id, type: 'Debited', status: 'On Hold' } },
		      	{ $group: { _id: null, total: { $sum: '$point' } } }
		    ]);

    		const totalOnHold = onHold[0]?.total || 0;

		    return totalOnHold;
		    
		} catch (error) {
	      console.error('Error calculate on hold point balance:', error);
	      return 0;
	    }
  	}
}
