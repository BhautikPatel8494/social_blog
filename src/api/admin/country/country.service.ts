import { Injectable } from '@nestjs/common';
import { Response, Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Country } from '@shared/interface/model.interface';
import { response } from '@root/shared/services/sendResponse.service';
import { RESPONSE_STATUS_CODES } from '@root/shared/constants';
import { CountryUpdateObj } from './country.interface';

@Injectable()
export class CountryService {

    constructor(
        @InjectModel('Gift') private readonly countryModel: Model<Country>,
    ) { }

    async createCountryRecord(req: Request, res: Response) {
        try {
            let { name, alias } = req.body;
            const checkForCountry = await this.countryModel.findOne({ name: name }).lean().exec();
            if (checkForCountry) {
                return response('features.country.alreadyExist', RESPONSE_STATUS_CODES.badRequest, res)
            }
            const addedCountry = await this.countryModel.create({ name, alias });
            return response('features.country.success', RESPONSE_STATUS_CODES.success, res, addedCountry)

        } catch (error) {
            return response('features.country.failed', RESPONSE_STATUS_CODES.serverError, res)
        }

    }

    async updateCountryInfo(req: Request, res: Response) {
        try {

            let { name, alias, _id } = req.body;
            const checkForCountry = await this.countryModel.findOneAndDelete({ _id: _id }).lean().exec();
            if (!checkForCountry) {
                return response('features.country.notFound', RESPONSE_STATUS_CODES.notFound, res)
            }

            let updateObj: CountryUpdateObj = {};
            name ? updateObj.name = name : null;
            alias ? updateObj.alias = alias : null;

            const updateCountry = await this.countryModel.findOneAndUpdate({ _id: _id }, { $set: updateObj }, { new: true }).lean().exec();
            return response('features.country.updated', RESPONSE_STATUS_CODES.success, res, updateCountry)

        } catch (error) {
            return response('features.country.update.failed', RESPONSE_STATUS_CODES.serverError, res)
        }
    }

    async deleteCountryFromList(req: Request, res: Response) {
        try {
            const { _id: id } = req.query;
            await this.countryModel.findByIdAndDelete(id).lean().exec();
            return response('features.country.delete.success', RESPONSE_STATUS_CODES.success, res)
        } catch (error) {
            return response('features.country.delete.failed', RESPONSE_STATUS_CODES.serverError, res)
        }

    }

    async getListOfCountrys(req: Request, res: Response) {
        try {
            const getCountryList = await this.countryModel.find({}).lean().exec();
            return response('features.country.list.success', RESPONSE_STATUS_CODES.success, res, getCountryList)
        } catch (error) {
            return response('features.country.list.failed', RESPONSE_STATUS_CODES.serverError, res)
        }
    }
}
