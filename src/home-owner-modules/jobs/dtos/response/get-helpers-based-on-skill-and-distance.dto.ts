import { eAPIResultStatus } from 'src/utils/enum';

export interface getHelperBasedonSkillAndDistanceResponseDTO {
  status?: eAPIResultStatus;
  NotFoundHelpersWithInDistance?: boolean;
  NotFoundHelpersBasedOnSkill?: boolean;
  data?: any;
  job_id?: string;
}
