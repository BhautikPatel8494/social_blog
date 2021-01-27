import { Body, Controller, Get, HttpCode, Post, Req, Res, UploadedFiles, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { Response, Request } from 'express';

import { AuthGuard } from '@nestjs/passport';
import { Roles } from '@middleware/role.decorator';
import { RolesGuard } from '@middleware/roles.gaurd';
import { UserTypes } from '@models/user.model';

import { UserService } from './user.service';
import { ChangeSubscriptionStatus } from './user.validation';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerUpload } from '@root/shared/services/fileUpload.service';

@Controller('api/v1/user')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) { }

    @Get('/')
    @HttpCode(200)
    @UseGuards(AuthGuard("jwt-device"), RolesGuard)
    @Roles(UserTypes.user)
    async getLogedInUserInfo(@Req() req: Request, @Res() res: Response) {
        return await this.userService.getLogedInUserInfo(req, res);
    }

    @Post('/update-profile')
    @HttpCode(200)
    @UseGuards(AuthGuard("jwt-device"), RolesGuard)
    @Roles(UserTypes.user)
    @UseInterceptors(
        FileFieldsInterceptor([
            {
                name: 'profilePicture',
                maxCount: 1,
            }
        ], multerUpload({ destination: 'profilePicture' })),
    )
    async updateUserProfile(@UploadedFiles() files: { [key: string]: any }, @Req() req: Request, @Res() res: Response) {
        return await this.userService.updateUserProfile(files, req, res);
    }

    @Post('/change-subscription-status')
    @HttpCode(200)
    @UseGuards(AuthGuard("jwt-device"), RolesGuard)
    @Roles(UserTypes.user)
    async changeSubscriptionStatus(@Body(new ValidationPipe()) data: ChangeSubscriptionStatus, @Req() req: Request, @Res() res: Response) {
        return await this.userService.changeSubscriptionStatus(req, res);
    }
}
