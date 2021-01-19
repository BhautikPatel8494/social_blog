import { Controller, Req, Res, Post, Get, Delete, Put, HttpCode, UseGuards } from '@nestjs/common';
import { AuthGuard } from "@nestjs/passport";
import { GiftService } from './gift.service'
import { Response, Request } from 'express';
import { RolesGuard } from "@middleware/roles.gaurd";
import { Roles } from '@middleware/role.decorator'

@Controller('gift')
export class GiftController {

    constructor(
        private readonly giftService: GiftService,
    ) { }


    // Add gift
    @Post('/')
    @HttpCode(200)
    @UseGuards(AuthGuard("jwt"), RolesGuard)
    @Roles("Admin")
    async addGift(@Req() req: Request, @Res() res: Response) {
        return await this.giftService.addGift(req, res);
    }

    // Update gift
    @Put('/')
    @HttpCode(200)
    @UseGuards(AuthGuard("jwt"), RolesGuard)
    @Roles("Admin")
    async updategoft(@Req() req: Request, @Res() res: Response) {
        return await this.giftService.updateGiftDetails(req, res);
    }

    // Remove gift
    @Delete('/')
    @HttpCode(200)
    @UseGuards(AuthGuard("jwt"), RolesGuard)
    @Roles("Admin")
    async deleteGiftCard(@Req() req: Request, @Res() res: Response) {
        return await this.giftService.deleteGiftDetails(req, res);
    }

    // Get gift list
    @Get('/')
    @HttpCode(200)
    async signUpForAdmin(@Req() req: Request, @Res() res: Response) {
        return await this.giftService.listGiftDetauls(req, res);
    }

}
