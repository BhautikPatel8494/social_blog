import { Controller, Req, Res, Post, Get, Delete, Put, HttpCode, UseGuards, ValidationPipe, Body } from '@nestjs/common';
import { AuthGuard } from "@nestjs/passport";
import { CountryService } from './country.service'
import { Response, Request } from 'express';
import { RolesGuard } from "../../../middleware/roles.gaurd";
import { Roles } from '../../../middleware/role.decorator'
import { UserTypes } from '../../../models/user.model';
import { UpsertCountry } from './country.validation';

@Controller('api/v1/country')
export class CountryController {

    constructor(
        private readonly countryService: CountryService,
    ) { }

    @Post('/')
    @HttpCode(200)
    @UseGuards(AuthGuard("jwt-device"), RolesGuard)
    @Roles(UserTypes.admin)
    async createCountryRecord(@Body(new ValidationPipe()) data: UpsertCountry, @Req() req: Request, @Res() res: Response) {
        return await this.countryService.createCountryRecord(req, res);
    }

    @Put('/:id')
    @HttpCode(200)
    @UseGuards(AuthGuard("jwt-device"), RolesGuard)
    @Roles(UserTypes.admin)
    async updateCountryInfo(@Body(new ValidationPipe()) data: UpsertCountry, @Req() req: Request, @Res() res: Response) {
        return await this.countryService.updateCountryInfo(req, res);
    }

    @Delete('/:id')
    @HttpCode(200)
    @UseGuards(AuthGuard("jwt-device"), RolesGuard)
    @Roles(UserTypes.admin)
    async deleteCountryFromList(@Req() req: Request, @Res() res: Response) {
        return await this.countryService.deleteCountryFromList(req, res);
    }

    @Get('/')
    @HttpCode(200)
    async getListOfCountrys(@Req() req: Request, @Res() res: Response) {
        return await this.countryService.getListOfCountrys(req, res);
    }
}
