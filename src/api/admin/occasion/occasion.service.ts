import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response, Request } from 'express';

import { Country, Occasion } from '@shared/interface/model.interface';
import { response } from '@root/shared/services/sendResponse.service';
import { RESPONSE_STATUS_CODES } from '@root/shared/constants';
@Injectable()
export class OccasionService {

    constructor(
        @InjectModel('Occasion') private readonly occasionModel: Model<Occasion>,
        @InjectModel('Country') private readonly countryModel: Model<Country>,
    ) { }

    async createOccasionInfo(req: Request, res: Response) {
        let { occasionName, description, countryId } = req.body
        if (countryId) {
            const countryExistWithSameName = await this.countryModel.findById(countryId).lean().exec();
            if (!countryExistWithSameName) countryId = null
        }
        const createOccationRecord = await this.occasionModel.create({ occasionName, description, countryId });
        return response('features.occasion.success', RESPONSE_STATUS_CODES.success, res, createOccationRecord)
    }

    async updateOccasionInfo(req: Request, res: Response) {
        let { occasionName, description, countryId } = req.body
        const { id } = req.params
        let occasionInfoInDb = await this.occasionModel.findById(id);
        if (!occasionInfoInDb) {
            return response('features.occasion.notExist', RESPONSE_STATUS_CODES.notFound, res)
        }
        if (countryId) {
            const countryExistWithSameName = await this.countryModel.findById(countryId).lean().exec();
            if (!countryExistWithSameName) countryId = null
        }
        occasionInfoInDb.occasionName = occasionName
        occasionInfoInDb.description = description
        occasionInfoInDb.countryId = countryId
        occasionInfoInDb.save()
        return response('features.occasion.updated', RESPONSE_STATUS_CODES.success, res, occasionInfoInDb)
    }

    async deleteOccasionRecord(req: Request, res: Response) {
        const { id } = req.params
        let occasionInfoInDb = await this.occasionModel.findById(id);
        if (!occasionInfoInDb) {
            return response('features.occasion.notExist', RESPONSE_STATUS_CODES.notFound, res)
        }
        occasionInfoInDb.isDeleted = true
        occasionInfoInDb.save()
        return response('features.occasion.deleted', RESPONSE_STATUS_CODES.success, res)
    }

    async getListOfOccasion(req: Request, res: Response) {
        const query = [
            {
                $match: { isDeleted: false }
            },
            {
                $lookup: {
                    from: 'countries',
                    localField: 'countryId',
                    foreignField: '_id',
                    as: 'countryInfo'
                }
            },
            {
                $group: {
                    _id: "$countryId",
                    countryName: { "$first": "$countryInfo" },
                    occations: { "$push": "$$ROOT" }
                }
            },
            {
                $project: {
                    _id: 0,
                    countryName: 1,
                    occations: 1
                }
            }
        ]
        let getOccasionList = await this.occasionModel.aggregate(query);
        let formattedList = {
            countryWiseOccasionList: [],
            commonOccasions: []
        }
        getOccasionList.map(oData => {
            if (oData.countryName[0]) {
                formattedList.countryWiseOccasionList.push({
                    countryName: oData.countryName[0].name,
                    occations: oData.occations.map(({ description, occasionName, _id }) => ({ description, occasionName, _id }))
                })
            } else {
                formattedList.commonOccasions.push(
                    ...oData.occations.map(({ description, occasionName, _id }) => ({ description, occasionName, _id }))
                )
            }
        })
        return response('features.occasion.list.success', RESPONSE_STATUS_CODES.success, res, formattedList)
    }
}
