import { Controller, Req, Res, Post, Get, Delete, Put, HttpCode, UseGuards, Body, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from "@nestjs/passport";
import { GiftService } from './giftRecommendation.service'
import { Response, Request } from 'express';
import { RolesGuard } from "@middleware/roles.gaurd";
import { Roles } from '@middleware/role.decorator'
import { UserTypes } from '@root/models/user.model';
import { ListOfGiftRecommendationForUser, UpsertGiftCategory, UpsertGiftRecommendation } from './giftRecommendation.validation';

@Controller('api/v1/gift')
export class GiftRecommendationController {

    constructor(
        private readonly giftService: GiftService,
    ) { }

    /*** Gift Recommendation Category API's */
    @Post('/category')
    @HttpCode(200)
    @UseGuards(AuthGuard("jwt-device"), RolesGuard)
    @Roles(UserTypes.admin)
    async addGiftRecommendationCategory(@Body(new ValidationPipe()) data: UpsertGiftCategory, @Req() req: Request, @Res() res: Response) {
        return await this.giftService.addGiftRecommendationCategory(req, res);
    }

    @Put('/category/:id')
    @HttpCode(200)
    @UseGuards(AuthGuard("jwt-device"), RolesGuard)
    @Roles(UserTypes.admin)
    async updateGiftRecommendationCategory(@Body(new ValidationPipe()) data: UpsertGiftCategory, @Req() req: Request, @Res() res: Response) {
        return await this.giftService.updateGiftRecommendationCategory(req, res);
    }

    @Delete('/category/:id')
    @HttpCode(200)
    @UseGuards(AuthGuard("jwt-device"), RolesGuard)
    @Roles(UserTypes.admin)
    async deleteGiftRecommendationCategory(@Req() req: Request, @Res() res: Response) {
        return await this.giftService.deleteGiftRecommendationCategory(req, res);
    }

    @Get('/category')
    @HttpCode(200)
    @UseGuards(AuthGuard("jwt-device"), RolesGuard)
    async listGiftRecommendationCategory(@Req() req: Request, @Res() res: Response) {
        return await this.giftService.listGiftRecommendationCategory(req, res);
    }

    /*** Gift Recommendation API's */
    @Post('/')
    @HttpCode(200)
    @UseGuards(AuthGuard("jwt-device"), RolesGuard)
    @Roles(UserTypes.admin)
    async addGiftRecommendation(@Body(new ValidationPipe()) data: UpsertGiftRecommendation, @Req() req: Request, @Res() res: Response) {
        return await this.giftService.addGiftRecommendation(req, res);
    }

    @Put('/:id')
    @HttpCode(200)
    @UseGuards(AuthGuard("jwt-device"), RolesGuard)
    @Roles(UserTypes.admin)
    async updateGiftRecommendation(@Body(new ValidationPipe()) data: UpsertGiftRecommendation, @Req() req: Request, @Res() res: Response) {
        return await this.giftService.updateGiftRecommendation(req, res);
    }

    @Delete('/:id')
    @HttpCode(200)
    @UseGuards(AuthGuard("jwt-device"), RolesGuard)
    @Roles(UserTypes.admin)
    async deleteGiftRecommendation(@Req() req: Request, @Res() res: Response) {
        return await this.giftService.deleteGiftRecommendation(req, res);
    }

    @Get('/')
    @HttpCode(200)
    async listGiftRecommendation(@Req() req: Request, @Res() res: Response) {
        return await this.giftService.listGiftRecommendation(req, res);
    }

    @Post('/user-gift')
    @HttpCode(200)
    async listOfRecommendationForUser(@Body(new ValidationPipe()) data: ListOfGiftRecommendationForUser, @Req() req: Request, @Res() res: Response) {
        return await this.giftService.listOfRecommendationForUser(req, res);
    }
}
