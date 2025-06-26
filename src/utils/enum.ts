export enum eAPIResultStatus {
  None = 0,
  Failure = 'failure',
  Success = 'success',
}


export enum Role {
  None = 0,
  Customer = 'customer',
  Helper = 'helper',
  Corporator = 'corporator',
  Admin = 'admin',
  Staff = 'staff' // 👈 Added Staff role
}

export enum Steps {
  None = 0,
  First = 'First',
  Second = 'Second',
  Third = 'Third',
  Completed = 'Completed',
}

export enum LoginType {
  None = 0,
  Email = 'email',
  Apple = 'apple',
  Google = 'google',
}

export enum UserAgent {
  None = 0,
  Browser = 'browser',
  MobileApp = 'mobile_app',
}

export enum LoginStatus {
  None = 0,
  Success = 'success',
  Failed = 'failed',
}

export enum JobType {
  None = 0,
  New = 'new',
  Change = 'change',
  Maintenance = 'maintenance',
}

export enum JobStatus {
  None = 0,
  No_Training = 'no_training',
  Training_Pending = 'training_pending',
  Approved = 'approved',
}

export enum OfferStatus {
  None = 0,
  Pending = 'pending',
  Accepted = 'accepted',
  Rejected = 'rejected',
}

export enum JobProgress {
  None = 0,
  Pending = 'pending',
  In_Progress = 'in_progress',
  Job_Completion_Confirmation = 'job_completion_confirmation',
  Completed = 'completed',
  Reviewed = 'reviewed',
  Rejected = 'rejected',
  Cancel = 'cancel',
}

export enum NotificationType {
  None = 0,
  Offer_Sent = 'offer_sent',
  Offer_Accepted = 'offer_accepted',
  Job_Extension_Requested = 'job_extension_requested',
  Offer_Received = 'offer_received',
  Job_Extension_Response = 'job_extension_response',
  Job_Postponed_Request = 'job_postponed_request',
  Job_Postponed_Response = 'job_postponed_response',
  Job_Canceled = 'job_canceled',
  Job_Completion_Submitted = 'job_completion_submitted',
  Job_Completion_Accepted = 'job_completion_accepted',
  Job_Completion_Rejected = 'job_completion_rejected',
  Job_Review = 'submit_job_review',
}

export enum PaymentStatus {
  None = 0,
  Pending = 'pending',
  Completed = 'completed',
  Failed = 'failed',
}

