import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export interface CreateHomeOwnerDTO {
  email?: string;
  password?: string;
  phoneNumber?: string;
  countryCode?: string;
}
