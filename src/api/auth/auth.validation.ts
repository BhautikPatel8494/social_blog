import { SocialMediaTypes } from '@root/models/user.model';
import { IsString, IsEmail, MinLength, IsOptional, IsNumber, IsEnum, IsNotEmpty } from 'class-validator';

export class SignInForUser {

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class ForgotPassword {

  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class ResetPassword {

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  newPassword: string;

  @IsNumber()
  @IsNotEmpty()
  code: number;
}

export class SignUpForUser {

  @IsString()
  @IsOptional()
  name: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
  password: string;

  @IsString()
  @IsOptional()
  birthDate: string;

  @IsNumber()
  @IsOptional()
  @IsEnum(Object.values(SocialMediaTypes))
  socialMediaType: number;

  @IsString()
  @IsOptional()
  socialMediaId: string;
}
export class ChangePassword {

  @IsString()
  oldPassword: string;

  @IsString()
  newPassword: string;
}

