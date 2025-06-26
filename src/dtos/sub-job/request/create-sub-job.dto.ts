import {
  GoodItem,
  JobName,
  ServiceFee,
  WorkingHour,
} from 'src/utils/Types/interfaces';
import { JobType } from 'src/utils/enum';

export class CreateSubJobRequestDTO {
  sub_job_name: JobName;

  main_job_id: number;

  ar_app_type: boolean;

  min_labor: number;

  job_type: JobType;

  good_list: GoodItem[];

  service_fee: ServiceFee;

  working_hour: ServiceFee;

  job_descriptions: JobName[];

  helper_provided_tool: JobName[];

  prior_job: JobName[];

  pre_conditions: JobName[];
}
