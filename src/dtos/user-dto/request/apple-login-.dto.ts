import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export interface AppleLoginDTO {
  identityToken: string;
}
