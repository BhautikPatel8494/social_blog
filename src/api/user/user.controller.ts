import { Body, Controller, HttpCode, Post, Req, Res, UseGuards, ValidationPipe } from '@nestjs/common';
import { Response, Request } from 'express';

import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../middleware/role.decorator';
import { RolesGuard } from '../../middleware/roles.gaurd';
import { UserTypes } from '../../models/user.model';
import { UserService } from './user.service';
import { ChangeSubscriptionStatus } from './user.validation';

@Controller('api/v1/user')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) { }

    @Post('/change-subscription-status')
    @HttpCode(200)
    @UseGuards(AuthGuard("jwt-device"), RolesGuard)
    @Roles(UserTypes.user)
    async changeSubscriptionStatus(@Body(new ValidationPipe()) data: ChangeSubscriptionStatus, @Req() req: Request, @Res() res: Response) {
        return await this.userService.changeSubscriptionStatus(req, res);
    }
}
