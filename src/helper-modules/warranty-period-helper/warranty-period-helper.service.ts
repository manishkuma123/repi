import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { eAPIResultStatus, JobProgress, NotificationType, Role, } from 'src/utils/enum';

import { User, UserDocument } from 'src/entitites/user';
import { ScheduledJob, ScheduledJobDocument} from 'src/entitites/scheduled-job';
import { CustomerWalletService } from 'src/modules/customer-wallet/customer-wallet.service';
import { HelperWalletService } from 'src/modules/helper-wallet/helper-wallet.service';
import { NotificationHomeOwnerService } from 'src/home-owner-modules/home-owner-notification/home-owner-notification.service';

@Injectable()
export class WarrantyPeriodHelperService {

	constructor(
	    @InjectModel(User.name)
	    private userModel: Model<UserDocument>,

	    @InjectModel(ScheduledJob.name)
    	private readonly scheduledJobModel: Model<ScheduledJobDocument>,

	    private readonly customerWalletService: CustomerWalletService,
   		private readonly helperWalletService: HelperWalletService,
   		private readonly notificationCustomerService: NotificationHomeOwnerService,
    ){}

    async updatewarrantyPeriodHelperService(helper_id: string, days: number): Promise<any> {
    	try {
      		
      		await this.userModel.findOneAndUpdate(
		        { _id:helper_id },
		        { defaultWarrantyPeriod: days},
		        { new: true },
		    );

      		return { status: eAPIResultStatus.Success };
	    } catch (error) {
	    	console.error('Error updating warranty period :', error);
	      	return { status: eAPIResultStatus.Failure };
	    }
  	}

    async releaseOnHoldPaymentCron(): Promise<any> {
    	try {

    		const endOfToday = new Date();
			endOfToday.setHours(23, 59, 59, 999);
      		
      		const scheduledJob = await this.scheduledJobModel.find({ 
      			job_status:"completed", 
      			warranty_expiration_date: { $lte: endOfToday },
      		});
		    console.log(scheduledJob);

		    for (const item of scheduledJob) {
		    	
		    	// order completed to customer wallet
		      	await this.customerWalletService.orderCompleted(
		        	'' + item?.customer_id,
		        	'' + item?._id,
		      	);

		      	// order completed to helper wallet
		      	await this.helperWalletService.orderCompleted(
		        	'' + item?.helper_id,
		        	'' + item?._id,
		      	);
		    }

      		return { status: eAPIResultStatus.Success };
	    } catch (error) {
	    	console.error('Error release on hold payment cron :', error);
	      	return { status: eAPIResultStatus.Failure };
	    }
  	}

  	async sendReviewNotificationCron(): Promise<any> {
    	try {

    		const currentDate = new Date();
		      		
      		const scheduledJob = await this.scheduledJobModel.find({ 
      			job_status:"completed", 
      			warranty_expiration_date: { $lte: currentDate },
      			sent_review_notification: { $ne: true },
      		});
		    
		    console.log(scheduledJob);

		    for (const item of scheduledJob) {

		    	const helperData: any = await this.userModel.findById(item?.helper_id);
		    	
		    	//send notification to customer
		      	const notificationDTO = {
			        image: helperData?.profile_url,
			        title: 'Please submit your review',
			        content: `The warranty period for job_id : ${item?._id} is completed. Click here to submit review for this job.`,
			        sender_id: '' + item?.helper_id?._id,
			        receiver_id: ''+ item?.customer_id,
			        receiver_type: Role.Customer,
			        sender_type: Role.Helper,
			        notification_type: NotificationType.Job_Review,
		      	};

		      	await this.notificationCustomerService.sendNotification(notificationDTO);

		      	await this.scheduledJobModel.updateOne(
			        { _id: item?._id },
			        {
			          $set: {
			            sent_review_notification: true,
			          },
			        },
			    );
		    	
		    }

      		return { status: eAPIResultStatus.Success };
	    } catch (error) {
	    	console.error('Error send review notification cron :', error);
	      	return { status: eAPIResultStatus.Failure };
	    }
  	}
}
