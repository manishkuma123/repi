import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CustomerWalletService } from '../customer-wallet/customer-wallet.service';
import { HelperWalletService } from './helper-wallet.service';

@Controller('helper-wallet')
export class HelperWalletController {
	constructor(
		private readonly customerWalletService: CustomerWalletService,
		private readonly helperWalletService: HelperWalletService
	) {}

	@Post('case-wallet')
  	async caseWallet(@Body() body: any) {

  		const walletEntry = await this.helperWalletService.getHelperCaseWallet(body.helper_id, body.page);

    	return walletEntry;
  	}

  	@Post('point-wallet')
  	async pointWallet(@Body() body: any) {

  		const walletEntry = await this.helperWalletService.getHelperPointWallet(body.helper_id, body.page);

    	return walletEntry;
  	}

  	@Post('distribute-promotional-points')
  	async distributePromotionalPoints(@Body() body: any) {
  		
  		const walletEntry = await this.helperWalletService.distributePromotionalPoints(body.helper_id, body.point, body.description);

    	return walletEntry;
  	}

  	@Post('check-available-points')
  	async checkAvailablePoints(@Body() body: any) {
  		
  		const availablePoints = await this.helperWalletService.checkAvailablePoints(body.helper_id, body.amount);

    	return availablePoints;
  	}

  	@Post('coin-top-up')
  	async coinTopup(@Body() body: any) {
  		
  		const coinTopup = await this.helperWalletService.addTopupPoints(body.helper_id, body.amount);

    	return coinTopup;
  	}
}
