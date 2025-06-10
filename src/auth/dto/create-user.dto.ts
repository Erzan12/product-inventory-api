import { IsEmail, IsNotEmpty, IsString, IsIn } from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsIn(['user','admin'])
    role: string;
}
