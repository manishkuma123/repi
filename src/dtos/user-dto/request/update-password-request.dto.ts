import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export interface UpdatePasswordRequestDTO {
    email:string;
    password:string;
}
