import { IsString, IsEmail, MinLength } from 'class-validator';

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

export class SocialMediaAuthantication {

  @IsString()
  socialMediaType: string;

  @IsString()
  socialMediaId: string;

  @IsString()
  email: string;
}

export class ChangePassword {

  @IsString()
  oldPassword: string;

  @IsString()
  newPassword: string;
}

