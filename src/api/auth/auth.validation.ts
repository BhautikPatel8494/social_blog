import { IsString, IsEmail, MinLength, IsOptional, IsNumber, IsPhoneNumber, IsNotEmpty } from 'class-validator';

// tslint:disable-next-line: max-classes-per-file
export class LoginForUser {

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  deviceToken: string;

  @IsString()
  deviceType: string;
}

// tslint:disable-next-line: max-classes-per-file
// export class LoginForAdmin {

//   @IsNotEmpty()
//   @IsString()
//   email: string;

//   @IsString()
//   @MinLength(8)
//   password: string;
// }

// tslint:disable-next-line: max-classes-per-file
// export class SignUpForAdmin {

//   @IsEmail()
//   email: string;

//   @IsString()
//   @MinLength(8)
//   password: string;
// }

// export class SignUpForUser {

//   @IsString()
//   firstName: string;

//   @IsString()
//   lastName: string;

//   @IsString()
//   phoneNumber: string;

//   @IsString()
//   countryCode: string;

//   @IsString()
//   callingCode: string;

//   @IsEmail()
//   email: string;

//   @IsString()
//   @MinLength(8)
//   password: string;
// }

// tslint:disable-next-line: max-classes-per-file
// export class ForGotPassword {

//   @IsEmail()
//   email: string;
// }

// tslint:disable-next-line: max-classes-per-file
// export class ResetPassword {

//   @IsEmail()
//   email: string;

//   @IsString()
//   @MinLength(8)
//   password: string;

//   @IsNumber()
//   code: number;
// }

// // tslint:disable-next-line: max-classes-per-file
// export class VerifyOTP {

//   @IsString()
//   phoneNumber: string;

//   @IsString()
//   otp: string;

//   @IsString()
//   callingCode: string;
// }

// // tslint:disable-next-line: max-classes-per-file
// export class ChangePassword {

//   @IsString()
//   oldPassword: string;

//   @IsString()
//   newPassword: string;
// }

// // tslint:disable-next-line: max-classes-per-file
// export class ForgotPassword {

//   @IsEmail()
//   email: string;
// }

// tslint:disable-next-line: max-classes-per-file
// export class VerifyOTPForNewNumber {

//   @IsString()
//   phoneNumber: string;

//   @IsString()
//   otp: string;

//   @IsString()
//   countryCode: string;

//   @IsString()
//   callingCode: string;
// }