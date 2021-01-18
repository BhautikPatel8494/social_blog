import { IsString, IsEmail, MinLength, IsOptional, IsNumber, IsPhoneNumber, IsNotEmpty } from 'class-validator';

export class SignInForUser {

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}

export class SignUpForUser {

  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsString()
  birthDate: string;
}

export class ChangePassword {

  @IsString()
  oldPassword: string;

  @IsString()
  newPassword: string;
}

