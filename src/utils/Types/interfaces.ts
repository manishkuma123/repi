import { JobStatus } from '../enum';

export interface JobName {
  en: string;
  th: string;
}

export interface ServiceFee {
  point?: {
    new?: number;
    change?: number;
  };
  area?: {
    new?: number;
    change?: number;
  };
}

export interface WorkingHour {
  point?: number;
  area?: number;
}

export interface GoodItem {
  name: JobName;
  qty_point?: number;
  qty_area?: number;
}

export interface EmergencyContact {
  name: string;
  phone_no: string;
  relation: string;
  address: string;
}

export interface RegisteredJob {
  main_job_id: string;
  sub_job_id: string;
  registered_date: Date;
  certificate_id?: string;
  trainings?: Object[];
  job_status?: JobStatus;
}

export interface Session {
  session_id: string;
  session_name: string;
  session_details: string;
  session_video_url: string;
  session_duration: number;
  session_content_files?: string[];
}

export interface Choice {
  id: number;
  choice: string;
}

export interface Test {
  test_id: string;
  test_no: number;
  question: string;
  type: string;
  choices: Choice[];
  answer: number;
}

export interface DistrictName {
  en: string;
  en_short:string;
  th: string;
}
