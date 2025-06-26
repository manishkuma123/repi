export class CreateOmiseChargeDto {
	amount: number; 

	point: number; 

	payment_type: string; 

	return_uri?: string; 

	card_token?: string;  

	source_id?: string;
	
	scheduled_job_id?: string;

	transaction_type?: string;
}
