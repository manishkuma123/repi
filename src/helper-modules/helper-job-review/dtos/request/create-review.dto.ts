export class CreateHelperJobReviewDTO {
  scheduled_job_id: string;
  punctual_rating: number;
  courteous_rating: number;
  efficient_rating: number;
  productive_rating: number;
  media_urls?: string[];
  tags?: string[];
  additional_feedback?: string;
  show_reviewer_name?: boolean;
  reviewer_name?: string;
}
