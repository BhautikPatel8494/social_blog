import { Injectable } from '@nestjs/common';
import { Country } from 'src/shared/interface/model.interface';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CountryService {

    constructor(
        @InjectModel('Gift') private readonly countryModel: Model<Country>,
    ) { }


    async addCountry(req: any, res: any) {
        try {
            let { name, alias } = req.body;
            const checkForCountry = await this.countryModel.findOne({ name: name }).lean().exec();
            if (checkForCountry !== undefined || checkForCountry !== undefined) {
                return res.json({ status: 400, msg: 'Country already exists', data: null })
            }
            const addedCountry = await this.countryModel.create({ name, alias });
            return res.json({ status: 200, msg: 'Country added sucessfully', data: addedCountry })

        } catch (error) {
            return res.json({ status: 500, msg: 'Error while adding country', err: error })
        }

    }

    async updateCountry(req: any, res: any) {
        try {

            let { name, alias, _id } = req.body;
            const checkForCountry = await this.countryModel.findOneAndDelete({ _id: _id }).lean().exec();
            if (checkForCountry === undefined || checkForCountry === null) {
                return res.json({ status: 200, msg: 'Country not  found', data: checkForCountry })
            }

            let updateObj: any = {};
            if (name !== undefined && name !== null) {
                updateObj.name = name;
            }

            if (alias !== undefined && alias !== null) {
                updateObj.alias = alias;
            }

            const updateCountry = await this.countryModel.findOneAndUpdate({ _id: _id }, { $set: updateObj }, { new: true }).lean().exec();
            return res.json({ status: 200, msg: 'Country updated  sucessfully', data: updateCountry })

        } catch (error) {
            return res.json({ status: 500, msg: 'Error while updating country', err: error })
        }
    }

    async deleteCountry(req: any, res: any) {
        try {
            const { _id } = req.query;
            const checkForCountry = await this.countryModel.findOneAndDelete({ _id: _id }).lean().exec();
            return res.json({ status: 200, msg: 'Country deleted sucessfully', data: checkForCountry })

        } catch (error) {
            return res.json({ status: 500, msg: 'Error while deleting country', err: error })
        }

    }

    async listCountries(req: any, res: any) {
        try {

            const checkForCountry = await this.countryModel.find({}).lean().exec();
            if (!checkForCountry.length) {
                return res.json({ status: 400, msg: 'Country not exists', data: null })
            }
            return res.json({ status: 200, msg: 'Country fetched sucessfully', data: checkForCountry })

        } catch (error) {
            return res.json({ status: 500, msg: 'Error while fetching country', err: error })
        }
    }
}
