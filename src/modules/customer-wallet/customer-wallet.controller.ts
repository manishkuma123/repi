import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CustomerWalletService } from './customer-wallet.service';
import { HelperWalletService } from '../helper-wallet/helper-wallet.service';

@Controller('customer-wallet')
export class CustomerWalletController {
	constructor(
		private readonly customerWalletService: CustomerWalletService,
		private readonly helperWalletService: HelperWalletService
	) {}

	@Post()
  	async create(@Body() body: any) {

  		// First Step To Credit Amount and Point to Wallet
    	/*const custResponse = await this.customerWalletService.creditedToWallet(body.customer_id, body.omise_charges_id, body.scheduled_job_id, body.amount, body.points);

    	const helperResponse = await this.helperWalletService.creditedToWallet(body.helper_id, body.scheduled_job_id, body.amount, body.points);*/

  		//------------------------------------------------------------------------------------------------------------

  		// Customer cancel booking before 48 hours
  		/*const custResponse = await this.customerWalletService.cancelsBefore48Hours(body.customer_id, body.scheduled_job_id);
    	const helperResponse = await this.helperWalletService.cancelsBefore48Hours(body.helper_id, body.scheduled_job_id);*/


  		//------------------------------------------------------------------------------------------------------------

  		// Customer cancel booking within 48 hours
  		/*const custResponse = await this.customerWalletService.cancelsWithin48Hours(body.customer_id, body.scheduled_job_id);
    	const helperResponse = await this.helperWalletService.cancelsWithin48Hours(body.helper_id, body.scheduled_job_id);*/


  		//------------------------------------------------------------------------------------------------------------

  		// Helper cancel booking
  		/*const custResponse = await this.customerWalletService.helperCancelsBooking(body.customer_id, body.scheduled_job_id);
    	const helperResponse = await this.helperWalletService.helperCancelsBooking(body.helper_id, body.scheduled_job_id);*/


  		//------------------------------------------------------------------------------------------------------------

  		// Customer No-Show policy
  		/*const custResponse = await this.customerWalletService.customerNoShowPolicy(body.customer_id, body.scheduled_job_id);
    	const helperResponse = await this.helperWalletService.customerNoShowPolicy(body.helper_id, body.scheduled_job_id);*/

    	//------------------------------------------------------------------------------------------------------------

  		// Helper No-Show policy
  		/*const custResponse = await this.customerWalletService.helperNoShowPolicy(body.customer_id, body.scheduled_job_id);
    	const helperResponse = await this.helperWalletService.helperNoShowPolicy(body.helper_id, body.scheduled_job_id);*/



  		//------------------------------------------------------------------------------------------------------------

    	// Last Step Complete Order
    	/*const custResponse = await this.customerWalletService.orderCompleted(body.customer_id, body.scheduled_job_id);
    	const helperResponse = await this.helperWalletService.orderCompleted(body.helper_id, body.scheduled_job_id);*/

    	//------------------------------------------------------------------------------------------------------------

  		// Distribute Promotional Points
  		//const custResponse = await this.customerWalletService.distributePromotionalPoints(body.customer_id, body.point, body.description);
    	//console.log("custResponse : ", custResponse);
  		
  		//const helperResponse = await this.helperWalletService.distributePromotionalPoints(body.helper_id, body.point, body.description);
    	//console.log("helperResponse : ", helperResponse);

    	//------------------------------------------------------------------------------------------------------------

    	// Refund 
    	/*const refundResponse = await this.customerWalletService.refundCharge(100, "chrg_test_63k33s76gbe22xvkd5q");
    	console.log("refundResponse : ", refundResponse);*/

    	/*console.log("custResponse : ", custResponse);
    	console.log("helperResponse : ", helperResponse);*/
    	return;
  	}

  	@Post('case-wallet')
  	async caseWallet(@Body() body: any) {

  		const walletEntry = await this.customerWalletService.getCustomerCaseWallet(body.customer_id, body.page);

    	return walletEntry;
  	}

  	@Post('received-point-wallet')
  	async receivedPointWallet(@Body() body: any) {

  		const walletEntry = await this.customerWalletService.getCustomerReceivedPointWallet(body.customer_id, body.page);

    	return walletEntry;
  	}

  	@Post('used-point-wallet')
  	async usedPointWallet(@Body() body: any) {

  		const walletEntry = await this.customerWalletService.getCustomerUsedPointWallet(body.customer_id, body.page);

    	return walletEntry;
  	}

  	@Post('distribute-promotional-points')
  	async distributePromotionalPoints(@Body() body: any) {
  		
  		const walletEntry = await this.customerWalletService.distributePromotionalPoints(body.customer_id, body.point, body.description);

    	return walletEntry;
  	}

  	@Post('available-points')
  	async getCustomerAvailablePoints(@Body() body: any) {
  		
  		const availablePoints = await this.customerWalletService.getCustomerAvailablePoints(body.customer_id);
  		
    	return availablePoints;
  	}
}
