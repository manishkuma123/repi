export interface CreatePostponedJobRequestDTO {
  job_id: string;
  helper_id: string;
  status?: string;
  start_date?: Date;
  end_date?: Date;
  start_time?: Date;
  end_time?: Date;
  start_time_stamp?: bigint;
  end_time_stamp?: bigint;
}
