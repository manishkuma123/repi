export interface CreateExtendedJobDTO {
  job_id: string;
  customer_id: string;
  cause: string;
  start_date?: Date;
  end_date?: Date;
  start_time?: Date;
  end_time?: Date;
  start_time_stamp?: bigint;
  end_time_stamp?: bigint;
  media: string[];
  note?: string;
}
