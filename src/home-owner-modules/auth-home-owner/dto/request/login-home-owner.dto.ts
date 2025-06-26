import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export interface LoginHomeOwnerDto {
  email: string;
  password: string;
}
