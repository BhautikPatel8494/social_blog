import { Body, Controller, Get, HttpCode, Post, Req, Res, UploadedFiles, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { GetSingleUser } from './user.validation';

@Controller('api/v1/user')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) { }

    @Get('/all')
    @HttpCode(200)
    async getAllUserInfo(@Req() req: Request, @Res() res: Response) {
        return await this.userService.getAllUserInfo(req, res);
    }

    @Post('/user-info')
    @HttpCode(200)
    @UseGuards(AuthGuard("jwt-device"))
    async getUserInfo(@Body(new ValidationPipe()) data: GetSingleUser, @Req() req: Request, @Res() res: Response) {
        return await this.userService.getUserInfo(req, res);
    }
}
