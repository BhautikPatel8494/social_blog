import { Controller, Post, Body, Res, Req, HttpCode, ValidationPipe, Put, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { SignUpForUser, SignInForUser, ChangePassword } from './auth.validation';

@Controller('/api/v1')
export class AuthDeviceController {
  constructor(
    private readonly authService: AuthService,
  ) { }

  // Admin Register
  @Post('/admin/register')
  @HttpCode(200)
  async signUpForAdmin(@Req() req: Request, @Res() res: Response) {
    return await this.authService.registerAdmin(req, res);
  }

  // Login
  @Post('/admin/login')
  @HttpCode(200)
  async loginForAdmin(@Req() req: Request, @Res() res: Response) {
    return await this.authService.loginForAdmin(req, res);
  }

  // Admin Register
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

  // Forgot-password
  @Post('/user/forgot-password')
  @HttpCode(200)
  async forgotPassword(@Req() req: Request, @Res() res: Response) {
    return await this.authService.forgotPassword(req, res);
  }

  // Reset-password
  @Post('/user/reset-password')
  @HttpCode(200)
  async resetPassword(@Req() req: Request, @Res() res: Response) {
    return await this.authService.resetPassword(req, res);
  }

  // Change Password
  @Post('/user/change-password')
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt-device'))
  async changePassword(@Body(new ValidationPipe()) data: ChangePassword, @Req() req: Request, @Res() res: Response) {
    return await this.authService.changePassword(req, res);
  }
}
