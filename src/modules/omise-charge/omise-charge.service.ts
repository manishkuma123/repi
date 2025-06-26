import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateOmiseChargeDto } from './dto/request/create-omise-charge.dto';
import { VerifyPaymentDto } from './dto/request/verify-payment.dto';
import { ResponseDTO } from 'src/dtos/general-response/general-response';
import { VerifyPaymentResponseDTO } from './dto/verify-payment-response.dto';
import { eAPIResultStatus, PaymentStatus } from 'src/utils/enum';
import * as Omise from 'omise';
import {
  OmiseCharge,
  OmiseChargeDocument,
} from 'src/entitites/omise-charge';

@Injectable()
export class OmiseChargeService {

  private omise: any;
  private omiseSecret: any;

  constructor(
    @InjectModel(OmiseCharge.name)
    private omiseChargeModel: Model<OmiseChargeDocument>,
  ) {

    this.omiseSecret = process.env.OMISE_SECRET_KEY?.replace(/^"(.*)"$/, '$1');

    console.log('OMISE_SECRET_KEY:', this.omiseSecret);
    this.omise = Omise({
      secretKey: this.omiseSecret
    });

  }

  async create(createOmiseChargeDto: CreateOmiseChargeDto): Promise<ResponseDTO> {

    try {

      let chargeId:string = '';
      let authorizeUri:string = '';
      let transactionType:string = '';

      if(createOmiseChargeDto.payment_type == 'card'){

        const charge = await this.omise.charges.create({
          amount: createOmiseChargeDto.amount * 100, // Omise uses the smallest currency unit
          currency: 'THB',
          card: createOmiseChargeDto.card_token,
          capture: true,
        });

        console.log('Charge Captured:', charge);
        chargeId = charge.id;

      }else{
        
        const charge = await this.omise.charges.create({
          amount: createOmiseChargeDto.amount * 100, // Omise uses the smallest currency unit
          currency: 'THB',
          source: createOmiseChargeDto.source_id, // Use token from frontend
          capture: true, // Capture immediately (default)
          return_uri: createOmiseChargeDto.return_uri
        });

        console.log('Charge Captured:', charge);

        chargeId = charge.id;
        authorizeUri = charge.authorize_uri

      }

      if(createOmiseChargeDto.transaction_type){
        transactionType = createOmiseChargeDto.transaction_type;
      }else{
        transactionType = "Customer Order";
      }

      const createdOmiseCharge = new this.omiseChargeModel(
        {
          "scheduled_job_id": createOmiseChargeDto.scheduled_job_id,
          "charge_id": chargeId,
          "price": createOmiseChargeDto.amount,
          "points": createOmiseChargeDto.point,
          "payment_status": "pending",
          "transaction_type": transactionType,
          "payment_date": Date.now()
        }
      );

      const result = await createdOmiseCharge.save();
      const omiseId = result._id;
      
      const data = {"chargeId":chargeId, "authorizeUri":authorizeUri, "omiseId":omiseId};
      return { status: eAPIResultStatus.Success, data };
    } catch (error) {
      console.log('Error:', error);
      let data = error;
      data.omiseKey = this.omiseSecret;

      return { status: eAPIResultStatus.Failure, data };
    }
  }

  async verifyPayment(verifyPaymentDto: VerifyPaymentDto): Promise<VerifyPaymentResponseDTO> {

    try {

      const omisecharges = await this.omiseChargeModel.findOne({
        charge_id: verifyPaymentDto.charge_id
      });

      if (!omisecharges) {

        let message = 'Transaction not found';
        return { status: eAPIResultStatus.Failure, message };
      }

      let message = "";
      let data = {"transactionStatus":omisecharges.payment_status};
      return { status: eAPIResultStatus.Success, message, data };
    } catch (error) {
      console.log('Error:', error);
      let message = error;

      return { status: eAPIResultStatus.Failure, message };
    }
  }

  async processWebhookEvent(payload: any) {
    const event = payload;
    console.log(event);

    switch (event.key) {
      case 'charge.create':
        return this.handleChargeCreate(event.data);
      case 'charge.complete':
        return this.handleChargeComplete(event.data);
      case 'charge.failed':
        return this.handleChargeFailed(event.data);
      // Add more if needed
      default:
        console.log('Unhandled event:', event.key);
    }
  }

  async handleChargeCreate(data: any) {
    const status = data.status;
    const sourceType = data.source?.type || 'card';
    const chargeId = data.id;

    if (status === 'successful') {

      console.log(`Charge successful instantly (source: ${sourceType})`);
      
      const updatedJob = await this.omiseChargeModel.findOneAndUpdate(
        { charge_id: chargeId },             // Filter condition
        {
          $set: {
            payment_status: PaymentStatus.Completed,
          },
        }
      );

    } else if (status === 'pending') {
      console.log(`Charge pending (source: ${sourceType}), waiting for completion`);
      // Store the charge and wait for charge.complete
    } else if (status === 'failed') {

      console.log(`Charge failed during creation`);

      const updatedJob = await this.omiseChargeModel.findOneAndUpdate(
        { charge_id: chargeId },             // Filter condition
        {
          $set: {
            payment_status: PaymentStatus.Failed,
          },
        }
      );
    }
  }

  async handleChargeComplete(data: any) {
    const chargeId = data.id;
    const status = data.status;

    if (status === 'successful') {
      console.log(`Delayed charge success (after pending) for charge ${chargeId}`);
      
      const updatedJob = await this.omiseChargeModel.findOneAndUpdate(
        { charge_id: chargeId },             // Filter condition
        {
          $set: {
            payment_status: PaymentStatus.Completed,
          },
        }
      );

    } else {
      console.log(`Charge completed but failed for charge ${chargeId}`);
      
      const updatedJob = await this.omiseChargeModel.findOneAndUpdate(
        { charge_id: chargeId },             // Filter condition
        {
          $set: {
            payment_status: PaymentStatus.Failed,
          },
        }
      );
    }
  }

  async handleChargeFailed(data: any) {
    const chargeId = data.id;
    const failureMessage = data.failure_message;

    // Log or notify about failure
    console.log('Charge failed:', chargeId, failureMessage);

    const updatedJob = await this.omiseChargeModel.findOneAndUpdate(
      { charge_id: chargeId },             // Filter condition
      {
        $set: {
          payment_status: PaymentStatus.Failed,
        },
      }
    );
  }

}
