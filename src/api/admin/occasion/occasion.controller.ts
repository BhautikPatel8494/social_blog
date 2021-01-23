import { Body, Controller, Delete, Get, HttpCode, Post, Put, Req, Res, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response, Request } from 'express';
import { Roles } from '../../../middleware/role.decorator';
import { RolesGuard } from '../../../middleware/roles.gaurd';
import { UserTypes } from '../../../models/user.model';
import { OccasionService } from './occasion.service';
import { UpsertOccasion } from './occasion.validation';

@Controller('api/v1/occasion')
export class OccasionController {

    constructor(
        private readonly occasionService: OccasionService,
    ) { }

    @Post('/')
    @HttpCode(200)
    @UseGuards(AuthGuard("jwt-device"), RolesGuard)
    @Roles(UserTypes.admin)
    async createOccasionInfo(@Body(new ValidationPipe()) data: UpsertOccasion, @Req() req: Request, @Res() res: Response) {
        return await this.occasionService.createOccasionInfo(req, res);
    }

    @Put('/:id')
    @HttpCode(200)
    @UseGuards(AuthGuard("jwt-device"), RolesGuard)
    @Roles(UserTypes.admin)
    async updateOccasionInfo(@Body(new ValidationPipe()) data: UpsertOccasion, @Req() req: Request, @Res() res: Response) {
        return await this.occasionService.updateOccasionInfo(req, res);
    }

    @Delete('/:id')
    @HttpCode(200)
    @UseGuards(AuthGuard("jwt-device"), RolesGuard)
    @Roles(UserTypes.admin)
    async deleteOccasionRecord(@Req() req: Request, @Res() res: Response) {
        return await this.occasionService.deleteOccasionRecord(req, res);
    }

    @Get('/')
    @HttpCode(200)
    @UseGuards(AuthGuard("jwt-device"), RolesGuard)
    @Roles(UserTypes.admin)
    async getListOfOccasion(@Req() req: Request, @Res() res: Response) {
        return await this.occasionService.getListOfOccasion(req, res);
    }

    @Get('/list')
    @HttpCode(200)
    @UseGuards(AuthGuard("jwt-device"), RolesGuard)
    @Roles(UserTypes.user)
    async getListOfOccasionForUser(@Req() req: Request, @Res() res: Response) {
        return await this.occasionService.getListOfOccasionForUser(req, res);
    }

}
