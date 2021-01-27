import { Controller, Req, Res, Post, Get, Delete, Put, HttpCode, UseGuards, ValidationPipe, Body } from '@nestjs/common';
import { AuthGuard } from "@nestjs/passport";
import { Response, Request } from 'express';

import { RolesGuard } from "@middleware/roles.gaurd";
import { Roles } from '@middleware/role.decorator'
import { UserTypes } from '@models/user.model';

import { InsertReminder, UpdateReminder } from './userReminder.validation';
import { UserReminderService } from './userReminder.service'

@Controller('api/v1/reminder')
export class UserRemindersController {

    constructor(
        private readonly reminderService: UserReminderService,
    ) { }

    @Post('/')
    @HttpCode(200)
    @UseGuards(AuthGuard("jwt-device"), RolesGuard)
    @Roles(UserTypes.user)
    async createReminder(@Body(new ValidationPipe()) data: InsertReminder, @Req() req: Request, @Res() res: Response) {
        return await this.reminderService.createReminder(req, res);
    }

    @Put('/:id')
    @HttpCode(200)
    @UseGuards(AuthGuard("jwt-device"), RolesGuard)
    @Roles(UserTypes.user)
    async updateReminder(@Body(new ValidationPipe()) data: UpdateReminder, @Req() req: Request, @Res() res: Response) {
        return await this.reminderService.updateReminder(req, res);
    }

    @Delete('/:id')
    @HttpCode(200)
    @UseGuards(AuthGuard("jwt-device"), RolesGuard)
    @Roles(UserTypes.user)
    async deleteReminder(@Req() req: Request, @Res() res: Response) {
        return await this.reminderService.deleteReminder(req, res);
    }

    @Get('/')
    @HttpCode(200)
    @UseGuards(AuthGuard("jwt-device"), RolesGuard)
    @Roles(UserTypes.user)
    async getListOfReminders(@Req() req: Request, @Res() res: Response) {
        return await this.reminderService.getListOfReminders(req, res);
    }
}
