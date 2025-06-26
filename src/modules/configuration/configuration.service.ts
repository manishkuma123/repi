import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { eAPIResultStatus } from 'src/utils/enum';
import { Configuration, ConfigurationDocument } from 'src/entitites/configuration';

@Injectable()
export class ConfigurationService {
	constructor(
  		@InjectModel(Configuration.name)
	    private configurationModel: Model<ConfigurationDocument>,
  	){}

  	// Get Configuration Values
  	async getConfiguration(): Promise<any> {

  		try {
  			let configData:any = {};

  			const configuration: any = await this.configurationModel.find();
  			
  			for (const item of configuration) {
  				configData[item.name] = item.value;
  			}	

		    return { status: eAPIResultStatus.Success, data: configData };

		} catch (error) {
	      console.error('Error get configuration:', error);
	      return { status: eAPIResultStatus.Failure };
	    }
  	}
}
