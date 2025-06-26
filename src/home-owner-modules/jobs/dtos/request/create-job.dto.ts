import { HomeOwnerAddressDocument } from 'src/entitites/home-owner-address';
import { JobName } from 'src/utils/Types/interfaces';

export class CreateSearchJobRequestDTO {
  main_job_id: string;
  sub_job_id: string;
  address: HomeOwnerAddressDocument;
  media: string[];
  prior_job: JobName[];
  pre_conditions_check_list: JobName[];
  quantity: number;
  price: number;
  time_taken_hours: number;
  site_details: string;
  start_date: Date;
  end_date: Date;
  time: Date;
  distance: number;
  start_time_stamp: number;
  end_time_stamp: number;
}
