import { Controller, Post, Body, Res, Req, HttpCode, ValidationPipe, Put, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { SignUpForUser, SignInForUser } from './auth.validation';

@Controller('/api/v1')
export class AuthDeviceController {
  constructor(
    private readonly authService: AuthService,
  ) { }

  // User Register
  @Post('/user/register')
  @HttpCode(200)
  async signUpForUser(@Body(new ValidationPipe()) data: SignUpForUser, @Req() req: Request, @Res() res: Response) {
    return await this.authService.signUpForUser(req, res);
  }

  // Login
  @Post('/user/login')
  @HttpCode(200)
  async loginForUser(@Body(new ValidationPipe()) data: SignInForUser, @Req() req: Request, @Res() res: Response) {
    return await this.authService.loginForUser(req, res);
  }
}
