import { HelperSignupRequestDTO } from 'src/dtos/user-dto/request/helper-signup.dto';
import { CreateSkillsHelperDTO } from 'src/helper-modules/expertise-helper/dtos/request/create-expertise-helper.dto';
import { CreateForeignPassportHelperDTO } from 'src/helper-modules/foreign-passport-helper/dto/request/create-foreign-passport-helper.dto';
import { CreateBankDetailsRequesDTO } from 'src/helper-modules/helper-bank-details/dtos/request/create-bank-details.dto';
import { CreateCriminalHistoryRequestDTO } from 'src/helper-modules/helper-criminal-history-check/dtos/request/create-criminal-history.dto';
import { CreateIdentityCardHelperDTO } from 'src/helper-modules/identity-card-helper/dto/request/create-identity-card-helper.dto';

export interface CreateHelperRequestDTO {
  helper: HelperSignupRequestDTO;
  skills: CreateSkillsHelperDTO;
  nationalIdentityData: CreateIdentityCardHelperDTO;
  foreignIdentityData: CreateForeignPassportHelperDTO;
  bankDetails: CreateBankDetailsRequesDTO;
  criminalHistory: CreateCriminalHistoryRequestDTO;
}
