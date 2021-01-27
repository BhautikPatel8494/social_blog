import { Injectable } from '@nestjs/common';
import { Response, Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Country, Occasion } from '@shared/interface/model.interface';
import { response } from '@shared/services/sendResponse.service';
import { RESPONSE_STATUS_CODES } from '@shared/constants';

@Injectable()
export class CountryService {

    constructor(
        @InjectModel('Occasion') private readonly occasionModel: Model<Occasion>,
        @InjectModel('Country') private readonly countryModel: Model<Country>,
    ) { }

    async createCountryRecord(req: Request, res: Response) {
        let { name, alias } = req.body;
        const countryExistWithSameName = await this.countryModel.findOne({ name });
        if (countryExistWithSameName) {
            return response('features.country.alreadyExist', RESPONSE_STATUS_CODES.badRequest, res)
        }
        const createCountryRecord = await this.countryModel.create({ name, alias });
        return response('features.country.success', RESPONSE_STATUS_CODES.success, res, createCountryRecord)
    }

    async updateCountryInfo(req: Request, res: Response) {
        const { name, alias } = req.body;
        const { id } = req.params
        const countryIsExistInDb = await this.countryModel.findById(id);
        if (!countryIsExistInDb) {
            return response('features.country.notFound', RESPONSE_STATUS_CODES.notFound, res)
        }
        const findNameIsAlreadyExist = await this.countryModel.find({ name, _id: { $nin: [id] } }).lean().exec();
        if (findNameIsAlreadyExist.length) return response('features.country.alreadyExist', RESPONSE_STATUS_CODES.badRequest, res)

        name ? countryIsExistInDb.name = name : null;
        alias ? countryIsExistInDb.alias = alias : null;

        countryIsExistInDb.save()
        return response('features.country.updated', RESPONSE_STATUS_CODES.success, res, countryIsExistInDb)
    }

    async deleteCountryFromList(req: Request, res: Response) {
        const { id } = req.params
        let findCountryById = await this.countryModel.findByIdAndDelete(id);
        if (!findCountryById) {
            return response('features.country.notFound', RESPONSE_STATUS_CODES.notFound, res)
        }
        await this.occasionModel.deleteMany({ countryId: id })
        return response('features.country.delete.success', RESPONSE_STATUS_CODES.success, res)
    }

    async getListOfCountrys(req: Request, res: Response) {
        const getCountryList = await this.countryModel.find().lean().exec();
        return response('features.country.list.success', RESPONSE_STATUS_CODES.success, res, getCountryList)
    }
}
