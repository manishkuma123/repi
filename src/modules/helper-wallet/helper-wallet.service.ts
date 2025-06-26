import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { eAPIResultStatus } from 'src/utils/enum';
import {HelperCashWallet, HelperCashWalletDocument} from 'src/entitites/helper-cash-wallet';
import {HelperPointWallet, HelperPointWalletDocument} from 'src/entitites/helper-point-wallet';
import {OmiseCharge, OmiseChargeDocument} from 'src/entitites/omise-charge';
import { ScheduledJob, ScheduledJobDocument } from 'src/entitites/scheduled-job';
import { ConfigurationService } from '../configuration/configuration.service';

@Injectable()
export class HelperWalletService {
	constructor(
  		@InjectModel(HelperCashWallet.name)
	    private helperCashWalletModel: Model<HelperCashWalletDocument>,

	    @InjectModel(HelperPointWallet.name)
	    private helperPointWalletModel: Model<HelperPointWalletDocument>,

	    @InjectModel(OmiseCharge.name)
    	private omiseChargeModel: Model<OmiseChargeDocument>,

    	@InjectModel(ScheduledJob.name)
    	private scheduledJobModel: Model<ScheduledJobDocument>,

    	private readonly configurationService: ConfigurationService,
  	){
  		
  	}

  	// Credit Is Coming amount and points to wallet
  	async creditedToWallet(helper_id: string, scheduled_job_id: string, amount: number, points: number): Promise<any> {

  		try {

  			const scheduledJob: any = await this.scheduledJobModel.findById(scheduled_job_id);
  			const configuration:any = await this.configurationService.getConfiguration();
  			const configData:any = configuration.data;
  			const platformFee = parseInt(configData?.PLATFORM_FEE);
  			const agentFee = parseInt(configData?.AGENT_FEE);

  			const orderNumber = scheduledJob?.order_number;

  			// Credited Is Coming amount to wallet entry 
	  		const createdCreditEntry = new this.helperCashWalletModel({
		        "helper_id": helper_id,
		        "scheduled_job_id": scheduled_job_id,
		        "amount": amount,
		        "type": "Credited",
		        "status": "Is Coming",
		        "description": "Is Coming",
		        "transaction_date": Date.now()
		    });

		    const creditResponse = await createdCreditEntry.save();
	   
		    if(points > 0){

		    	// Credited Is Coming point wallet entry 
		  		const pointEntry = new this.helperPointWalletModel({
			        "helper_id": helper_id,
			        "scheduled_job_id": scheduled_job_id,
			        "point": points,
			        "type": "Credited",
			        "status": "Is Coming",
			        "sub_type": "",
			        "description": "Is Coming",
			        "transaction_date": Date.now()
			    });
			    const pointResponse = await pointEntry.save();
			}

			const orderAmount = (amount + points);
			const platformFeePoint = ((orderAmount * platformFee) / 100);
			const agentFeePoint = ((orderAmount * agentFee) / 100);

	    	// On Hold platform fee to point wallet entry 
	  		const platformFeePointEntry = new this.helperPointWalletModel({
		        "helper_id": helper_id,
		        "scheduled_job_id": scheduled_job_id,
		        "point": platformFeePoint,
		        "type": "Debited",
		        "status": "On Hold",
		        "sub_type": "Platform_fee",
		        "description": "Platform Fee On Hold",
		        "transaction_date": Date.now()
		    });

		    const platformFeePointResponse = await platformFeePointEntry.save();

		    // On Hold agent fee to point wallet entry 
	  		const agentFeePointEntry = new this.helperPointWalletModel({
		        "helper_id": helper_id,
		        "scheduled_job_id": scheduled_job_id,
		        "point": agentFeePoint,
		        "type": "Debited",
		        "status": "On Hold",
		        "sub_type": "Agent_fee",
		        "description": "Agent Fee On Hold",
		        "transaction_date": Date.now()
		    });

		    const agentFeePointResponse = await agentFeePointEntry.save();
		    

		    return { status: eAPIResultStatus.Success };

		} catch (error) {
	      console.error('Error creating wallet:', error);
	      return { status: eAPIResultStatus.Failure };
	    }
  	}

  	// Customer cancel booking before 48 hours
  	async cancelsBefore48Hours(helper_id: string, scheduled_job_id: string): Promise<any> {

  		try {

  			const scheduledJob: any = await this.scheduledJobModel.findById(scheduled_job_id);

  			const orderNumber = scheduledJob?.order_number;

  			const omiseCharge = await this.omiseChargeModel
		      .findOne({
		        scheduled_job_id: '' + scheduled_job_id,
		        payment_status: 'completed',
		    });

		    if (!omiseCharge) {
		        return { status: eAPIResultStatus.Failure, notFound: true };
		    }

		    // Cancel Is Coming amount to case wallet
		    await this.helperCashWalletModel.updateOne(
		        { scheduled_job_id: scheduled_job_id, status: 'Is Coming' },
		        { $set: { status: 'Cancelled', description:'Cancelled'} },
		    );

		    if(omiseCharge?.points > 0){
		    	
		    	// Cancel Is Coming point to point wallet
			    await this.helperPointWalletModel.updateOne(
			        { scheduled_job_id: scheduled_job_id, status: 'Is Coming' },
			        { $set: { status: 'Cancelled', description:'Cancelled'} },
			    );
		    }		      
	    
		    // Cancel platform fee to point wallet
		    await this.helperPointWalletModel.updateOne(
		        { scheduled_job_id: scheduled_job_id, status: 'On Hold', sub_type: 'Platform_fee' },
		        { $set: { status: 'Cancelled'} },
		    );

		    // Cancel agent fee to point wallet
		    await this.helperPointWalletModel.updateOne(
		        { scheduled_job_id: scheduled_job_id, status: 'On Hold', sub_type: 'Agent_fee' },
		        { $set: { status: 'Cancelled'} },
		    );

		   
		    return { status: eAPIResultStatus.Success };
		    
		} catch (error) {
	      console.error('Error cancellation before 48 hours wallet:', error);
	      return { status: eAPIResultStatus.Failure };
	    }
  	}

  	// Customer cancel booking within 48 hours
  	async cancelsWithin48Hours(helper_id: string, scheduled_job_id: string): Promise<any> {

  		try {

  			const scheduledJob: any = await this.scheduledJobModel.findById(scheduled_job_id);

  			const orderNumber = scheduledJob?.order_number;

  			const omiseCharge = await this.omiseChargeModel
		      .findOne({
		        scheduled_job_id: '' + scheduled_job_id,
		        payment_status: 'completed',
		    });

		    if (!omiseCharge) {
		        return { status: eAPIResultStatus.Failure, notFound: true };
		    }

		    // Cancel Is Coming amount to case wallet
		    await this.helperCashWalletModel.updateOne(
		        { scheduled_job_id: scheduled_job_id, status: 'Is Coming' },
		        { $set: { status: 'Cancelled', description:'Cancelled'} },
		    );

		    if(omiseCharge?.points > 0){
		    	
		    	// Cancel Is Coming point to point wallet
			    await this.helperPointWalletModel.updateOne(
			        { scheduled_job_id: scheduled_job_id, status: 'Is Coming' },
			        { $set: { status: 'Cancelled', description:'Cancelled'} },
			    );
		    }		      
	    
		    // Cancel platform fee to point wallet
		    await this.helperPointWalletModel.updateOne(
		        { scheduled_job_id: scheduled_job_id, status: 'On Hold', sub_type: 'Platform_fee' },
		        { $set: { status: 'Cancelled'} },
		    );

		    // Cancel agent fee to point wallet
		    await this.helperPointWalletModel.updateOne(
		        { scheduled_job_id: scheduled_job_id, status: 'On Hold', sub_type: 'Agent_fee' },
		        { $set: { status: 'Cancelled'} },
		    );
		   
		    return { status: eAPIResultStatus.Success };
		    
		} catch (error) {
	      console.error('Error cancellation within 48 hours wallet:', error);
	      return { status: eAPIResultStatus.Failure };
	    }
  	}

  	// Helper cancel booking
  	async helperCancelsBooking(helper_id: string, scheduled_job_id: string): Promise<any> {

  		try {

  			const scheduledJob: any = await this.scheduledJobModel.findById(scheduled_job_id);

  			const orderNumber = scheduledJob?.order_number;

  			const omiseCharge = await this.omiseChargeModel
		      .findOne({
		        scheduled_job_id: '' + scheduled_job_id,
		        payment_status: 'completed',
		    });

		    if (!omiseCharge) {
		        return { status: eAPIResultStatus.Failure, notFound: true };
		    }

		    // Cancel Is Coming amount to case wallet
		    await this.helperCashWalletModel.updateOne(
		        { scheduled_job_id: scheduled_job_id, status: 'Is Coming' },
		        { $set: { status: 'Cancelled', description:'Cancelled'} },
		    );

		    if(omiseCharge?.points > 0){
		    	
		    	// Cancel Is Coming point to point wallet
			    await this.helperPointWalletModel.updateOne(
			        { scheduled_job_id: scheduled_job_id, status: 'Is Coming' },
			        { $set: { status: 'Cancelled', description:'Cancelled'} },
			    );
		    }		      
	    
		    // Deducted platform fee to point wallet
		    await this.helperPointWalletModel.updateOne(
		        { scheduled_job_id: scheduled_job_id, status: 'On Hold', sub_type: 'Platform_fee' },
		        { $set: { status: 'Completed'} },
		    );

		    // Cancel agent fee to point wallet
		    await this.helperPointWalletModel.updateOne(
		        { scheduled_job_id: scheduled_job_id, status: 'On Hold', sub_type: 'Agent_fee' },
		        { $set: { status: 'Cancelled'} },
		    );

		    return { status: eAPIResultStatus.Success };
		    
		} catch (error) {
	      console.error('Error helper cancellation wallet:', error);
	      return { status: eAPIResultStatus.Failure };
	    }
  	}

  	// Customer No-Show policy
  	async customerNoShowPolicy(helper_id: string, scheduled_job_id: string): Promise<any> {

  		try {

  			const scheduledJob: any = await this.scheduledJobModel.findById(scheduled_job_id);

  			const orderNumber = scheduledJob?.order_number;

  			const omiseCharge = await this.omiseChargeModel
		      .findOne({
		        scheduled_job_id: '' + scheduled_job_id,
		        payment_status: 'completed',
		    });

		    if (!omiseCharge) {
		        return { status: eAPIResultStatus.Failure, notFound: true };
		    }

		    const partialAmount = ((omiseCharge.price * 50) / 100);

		    // Complete Is Coming amount to case wallet
		    await this.helperCashWalletModel.updateOne(
		        { scheduled_job_id: scheduled_job_id, status: 'Is Coming' },
		        { $set: { status: 'Completed', amount: partialAmount, description:'Received'} },
		    );
		  
		    if(omiseCharge?.points > 0){

			    const partialPoints = ((omiseCharge?.points * 50) / 100);
			    
			    // Complete Is Coming amount to case wallet
			    await this.helperPointWalletModel.updateOne(
			        { scheduled_job_id: scheduled_job_id, status: 'Is Coming' },
			        { $set: { status: 'Completed', point: partialPoints, description:'Received'} },
			    );			    	
		    }

		    // Deducted platform fee to point wallet
		    await this.helperPointWalletModel.updateOne(
		        { scheduled_job_id: scheduled_job_id, status: 'On Hold', sub_type: 'Platform_fee' },
		        { $set: { status: 'Completed'} },
		    );

		    // Cancel agent fee to point wallet
		    await this.helperPointWalletModel.updateOne(
		        { scheduled_job_id: scheduled_job_id, status: 'On Hold', sub_type: 'Agent_fee' },
		        { $set: { status: 'Cancelled'} },
		    );

		    return { status: eAPIResultStatus.Success };
		    
		} catch (error) {
	      console.error('Error customer no show policy wallet:', error);
	      return { status: eAPIResultStatus.Failure };
	    }
  	}

  	// Helper No-Show policy
  	async helperNoShowPolicy(helper_id: string, scheduled_job_id: string): Promise<any> {

  		try {

  			const scheduledJob: any = await this.scheduledJobModel.findById(scheduled_job_id);

  			const orderNumber = scheduledJob?.order_number;

  			const omiseCharge = await this.omiseChargeModel
		      .findOne({
		        scheduled_job_id: '' + scheduled_job_id,
		        payment_status: 'completed',
		    });

		    if (!omiseCharge) {
		        return { status: eAPIResultStatus.Failure, notFound: true };
		    }

		    // Cancelled Is Coming amount to case wallet
		    await this.helperCashWalletModel.updateOne(
		        { scheduled_job_id: scheduled_job_id, status: 'Is Coming' },
		        { $set: { status: 'Cancelled', description:'Cancelled'} },
		    );
		  
		    if(omiseCharge?.points > 0){
			   			   
			    // Cancelled Is Coming amount to case wallet
			    await this.helperPointWalletModel.updateOne(
			        { scheduled_job_id: scheduled_job_id, status: 'Is Coming' },
			        { $set: { status: 'Cancelled', description:'Cancelled'} },
			    );			    	
		    }
		    
	    	// Deducted platform fee to point wallet
		    await this.helperPointWalletModel.updateOne(
		        { scheduled_job_id: scheduled_job_id, status: 'On Hold', sub_type: 'Platform_fee' },
		        { $set: { status: 'Completed'} },
		    );

		    // Cancel agent fee to point wallet
		    await this.helperPointWalletModel.updateOne(
		        { scheduled_job_id: scheduled_job_id, status: 'On Hold', sub_type: 'Agent_fee' },
		        { $set: { status: 'Cancelled'} },
		    );
		    
		    return { status: eAPIResultStatus.Success };
		    
		} catch (error) {
	      console.error('Error helper no show policy wallet:', error);
	      return { status: eAPIResultStatus.Failure };
	    }
  	}

  	// Order completed
  	async orderCompleted(helper_id: string, scheduled_job_id: string): Promise<any> {

  		try {

  			const scheduledJob: any = await this.scheduledJobModel.findById(scheduled_job_id);

  			const orderNumber = scheduledJob?.order_number;

  			const omiseCharge = await this.omiseChargeModel
		      .findOne({
		        scheduled_job_id: '' + scheduled_job_id,
		        payment_status: 'completed',
		    });


		    if (!omiseCharge) {
		        return { status: eAPIResultStatus.Failure, notFound: true };
		    }
			
			// Completed Is Coming amount to case wallet
		    await this.helperCashWalletModel.updateOne(
		        { scheduled_job_id: scheduled_job_id, status: 'Is Coming' },
		        { $set: { status: 'Completed', description:'Received'} },
		    );
		  
		    if(omiseCharge?.points > 0){
			   			   
			    // Completed Is Coming amount to case wallet
			    await this.helperPointWalletModel.updateOne(
			        { scheduled_job_id: scheduled_job_id, status: 'Is Coming' },
			        { $set: { status: 'Completed', description:'Received'} },
			    );			    	
		    }

		    // Deducted platform fee to point wallet
		    await this.helperPointWalletModel.updateOne(
		        { scheduled_job_id: scheduled_job_id, status: 'On Hold', sub_type: 'Platform_fee' },
		        { $set: { status: 'Completed', description:"Platform Fee"} },
		    );

		    // Deducted agent fee to point wallet
		    await this.helperPointWalletModel.updateOne(
		        { scheduled_job_id: scheduled_job_id, status: 'On Hold', sub_type: 'Agent_fee' },
		        { $set: { status: 'Completed', description:"Agent Fee"} },
		    );
		    
		    return { status: eAPIResultStatus.Success };
		    
		} catch (error) {
	      console.error('Error order completed wallet:', error);
	      return { status: eAPIResultStatus.Failure };
	    }
  	}

  	// Get helper case wallet
  	async getHelperCaseWallet(helper_id: string, page: number): Promise<any> {

  		try {

  			const pageNumber = page || 1;
			const limit = 10;
			const skip = (pageNumber - 1) * limit;

		    const caseWalletEntry = await this.helperCashWalletModel
		      	.find({ helper_id: '' + helper_id })
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
          	

          	const totalRecord = await this.helperCashWalletModel.countDocuments({
			  	helper_id: '' + helper_id,
			});

		    if (!caseWalletEntry) {
		        return { status: eAPIResultStatus.Failure, data: [] };
		    }

		    const availableBalance = await this.calculateHelperAvailableBalance(helper_id);
		    const availablePoints = await this.calculateHelperAvailablePointsBalance(helper_id);
		    const isComingBalance = await this.calculateHelperIsComingBalance(helper_id);
		    const isComingPoints = await this.calculateHelperIsComingPointsBalance(helper_id);
		    const onHoldPoints = await this.calculateHelperOnHoldPointsBalance(helper_id);
			
			const meta = { 
		    	"currentPage": pageNumber,			    
			    "totalPages": Math.ceil(totalRecord / limit),			    
		    	"availableBalance": availableBalance,
		    	"availablePoints": (availablePoints - onHoldPoints),			    
		    	"isComingBalance": isComingBalance,			    
		    	"isComingPoints": isComingPoints,			    
			};

		    return { status: eAPIResultStatus.Success, data:caseWalletEntry, meta:meta };
		    
		} catch (error) {
	      console.error('Error case wallet:', error);
	      return { status: eAPIResultStatus.Failure, data: [] };
	    }
  	}

  	// Get helper point wallet
  	async getHelperPointWallet(helper_id: string, page: number): Promise<any> {

  		try {

  			const pageNumber = page || 1;
			const limit = 10;
			const skip = (pageNumber - 1) * limit;

		    const pointWalletEntry = await this.helperPointWalletModel
		      	.find({ helper_id: '' + helper_id })
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
          	
          	const totalRecord = await this.helperPointWalletModel.countDocuments({
			  	helper_id: '' + helper_id,
			});

		    if (!pointWalletEntry) {
		        return { status: eAPIResultStatus.Failure, data: [] };
		    }
			
			const availableBalance = await this.calculateHelperAvailableBalance(helper_id);
		    const availablePoints = await this.calculateHelperAvailablePointsBalance(helper_id);
		    const isComingBalance = await this.calculateHelperIsComingBalance(helper_id);
		    const isComingPoints = await this.calculateHelperIsComingPointsBalance(helper_id);
		    const onHoldPoints = await this.calculateHelperOnHoldPointsBalance(helper_id);
			
			const meta = { 
		    	"currentPage": pageNumber,			    
			    "totalPages": Math.ceil(totalRecord / limit),			    
		    	"availableBalance": availableBalance,
		    	"availablePoints": (availablePoints - onHoldPoints),			    
		    	"isComingBalance": isComingBalance,			    
		    	"isComingPoints": isComingPoints,			    
			};

		    return { status: eAPIResultStatus.Success, data:pointWalletEntry, meta:meta };
		    
		} catch (error) {
	      console.error('Error point wallet:', error);
	      return { status: eAPIResultStatus.Failure, data: [] };
	    }
  	}

  	// Distribute Promotional Points
  	async distributePromotionalPoints(helper_id: string, point: number, description: string): Promise<any> {

  		try {

		    if(point > 0){

		    	const configuration:any = await this.configurationService.getConfiguration();
  				const configData:any = configuration.data;
  				const expirationDays = parseInt(configData?.COIN_EXPIRATION_TIME);

  				const currentDate = new Date();
				const expirationDate = new Date(currentDate.getTime() + expirationDays * 24 * 60 * 60 * 1000);
		    	
		  		const createdPointEntry = new this.helperPointWalletModel({
			        "helper_id": helper_id,			        
			        "scheduled_job_id": null,
			        "point": point,
			        "type": "Credited",
			        "sub_type": "",
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

  	// Check Available Points
  	async checkAvailablePoints(helper_id: string, amount: number): Promise<any> {

  		try {

		    const availablePoints = await this.calculateHelperAvailablePointsBalance(helper_id);		   
		    const onHoldPoints = await this.calculateHelperOnHoldPointsBalance(helper_id);
		    const balancedPoints = (availablePoints - onHoldPoints);

		    const configuration:any = await this.configurationService.getConfiguration();
  			const configData:any = configuration.data;
  			const platformFee = parseInt(configData?.PLATFORM_FEE);
  			const agentFee = parseInt(configData?.AGENT_FEE);
  			const fees = (platformFee + agentFee);

		    const requiredPoints = ((amount * fees) / 100);
		    let balanceAvailable = true;

		    if(balancedPoints < requiredPoints){
		    	balanceAvailable = false;
		    }

		    return { status: eAPIResultStatus.Success, balanceAvailable: balanceAvailable };
		    
		} catch (error) {
	      console.error('Error check available points:', error);
	      return { status: eAPIResultStatus.Failure };
	    }
  	}

  	// Top up Points
  	async addTopupPoints(helper_id: string, point: number): Promise<any> {

  		try {

	  		const topupEntry = new this.helperPointWalletModel({
		        "helper_id": helper_id,
		        "scheduled_job_id": null,
		        "point": point,
		        "type": "Credited",
		        "status": "Completed",
		        "sub_type": "",
		        "description": "Coin Top-up",
		        "transaction_date": Date.now()
		    });
		    const topupResponse = await topupEntry.save();

		    return { status: eAPIResultStatus.Success };
		    
		} catch (error) {
	      console.error('Error check available points:', error);
	      return { status: eAPIResultStatus.Failure };
	    }
  	}


  	/*============================= Custom Function ==============================*/

  	// Calculate available case balance
  	async calculateHelperAvailableBalance(helper_id: string): Promise<any> {

  		try {

		    const credited = await this.helperCashWalletModel.aggregate([
		      	{ $match: { helper_id: helper_id, type: 'Credited', status: 'Completed' } },
		      	{ $group: { _id: null, total: { $sum: '$amount' } } }
		    ]);

			const debited = await this.helperCashWalletModel.aggregate([
  				{ $match: { helper_id: helper_id, type: 'Debited', status: 'Completed' } },
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

  	// Calculate available points balance
  	async calculateHelperAvailablePointsBalance(helper_id: string): Promise<any> {

  		try {

		    const credited = await this.helperPointWalletModel.aggregate([
		      	{ $match: { helper_id: helper_id, type: 'Credited', status: 'Completed' } },
		      	{ $group: { _id: null, total: { $sum: '$point' } } }
		    ]);

			const debited = await this.helperPointWalletModel.aggregate([
  				{ $match: { helper_id: helper_id, type: 'Debited', status: 'Completed' } },
  				{ $group: { _id: null, total: { $sum: '$point' } } }
			]);

    		const totalCredited = credited[0]?.total || 0;
    		const totalDebited = debited[0]?.total || 0;

    		const balancedPoints =  totalCredited - totalDebited;

		    return balancedPoints;
		    
		} catch (error) {
	      console.error('Error calculate available point balance:', error);
	      return 0;
	    }
  	}

  	// Calculate IsComing case balance
  	async calculateHelperIsComingBalance(helper_id: string): Promise<any> {

  		try {

		    const isComing = await this.helperCashWalletModel.aggregate([
		      	{ $match: { helper_id: helper_id, type: 'Credited', status: 'Is Coming' } },
		      	{ $group: { _id: null, total: { $sum: '$amount' } } }
		    ]);

    		const totalIsComing = isComing[0]?.total || 0;

		    return totalIsComing;
		    
		} catch (error) {
	      console.error('Error calculate IsComing balance:', error);
	      return 0;
	    }
  	}

  	// Calculate IsComing points balance
  	async calculateHelperIsComingPointsBalance(helper_id: string): Promise<any> {

  		try {

		    const isComingPoints = await this.helperPointWalletModel.aggregate([
		      	{ $match: { helper_id: helper_id, type: 'Credited', status: 'Is Coming' } },
		      	{ $group: { _id: null, total: { $sum: '$point' } } }
		    ]);

    		const totalIsComingPoints = isComingPoints[0]?.total || 0;

		    return totalIsComingPoints;
		    
		} catch (error) {
	      console.error('Error calculate IsComing balance:', error);
	      return 0;
	    }
  	}

  	// Calculate on hold points balance
  	async calculateHelperOnHoldPointsBalance(helper_id: string): Promise<any> {

  		try {

  			const onHold = await this.helperPointWalletModel.aggregate([
		      	{ $match: { helper_id: helper_id, type: 'Debited', status: 'On Hold' } },
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
