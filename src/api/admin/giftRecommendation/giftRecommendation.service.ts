import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { GiftRecommendation, GiftRecommendationCategory, UserReminder } from '@shared/interface/model.interface';
import { response } from '@root/shared/services/sendResponse.service';
import { RESPONSE_STATUS_CODES } from '@root/shared/constants';
import { Request } from 'express';
import { ListOfGenderSelectionOptions } from '@root/api/user/userReminder/userReminder.validation';

@Injectable()
export class GiftService {

    constructor(
        @InjectModel('GiftRecommendation') private readonly giftRecommendationModel: Model<GiftRecommendation>,
        @InjectModel('GiftRecommendationCategory') private readonly giftRecommendationCategoryModel: Model<GiftRecommendationCategory>,
        @InjectModel('Reminders') private readonly reminderModel: Model<UserReminder>,
    ) { }

    async addGiftRecommendationCategory(req: any, res: any) {
        const { categoryName, gender } = req.body;
        const alreadyExistWithSameName = await this.giftRecommendationCategoryModel.findOne({ categoryName }).lean().exec()
        if (alreadyExistWithSameName) {
            return response('features.gift.category.alreadyExist', RESPONSE_STATUS_CODES.badRequest, res)
        }
        const createGiftCardCategory = await this.giftRecommendationCategoryModel.create({ categoryName, gender });
        return response('features.gift.category.success', RESPONSE_STATUS_CODES.success, res, createGiftCardCategory)
    }

    async updateGiftRecommendationCategory(req: Request, res: any) {
        const { categoryName, gender } = req.body;
        const { id } = req.params;
        let giftCategoryExist = await this.giftRecommendationCategoryModel.findById(id)
        if (!giftCategoryExist) {
            return response('features.gift.category.notFound', RESPONSE_STATUS_CODES.notFound, res)
        }
        giftCategoryExist.categoryName = categoryName
        giftCategoryExist.gender = gender
        giftCategoryExist.save()
        return response('features.gift.category.updated', RESPONSE_STATUS_CODES.success, res, giftCategoryExist)
    }

    async deleteGiftRecommendationCategory(req: any, res: any) {
        const { id } = req.params;
        let deleteGiftCategory = await this.giftRecommendationCategoryModel.findByIdAndDelete(id)
        if (!deleteGiftCategory) {
            return response('features.gift.category.notFound', RESPONSE_STATUS_CODES.notFound, res)
        }
        return response('features.gift.category.deleted', RESPONSE_STATUS_CODES.success, res)
    }

    async listGiftRecommendationCategory(req: any, res: any) {
        let listOfGiftCategory = await this.giftRecommendationCategoryModel.find().lean().exec()
        return response('features.gift.category.listGet', RESPONSE_STATUS_CODES.success, res, listOfGiftCategory)
    }

    async addGiftRecommendation(req: any, res: any) {
        const { giftName, categoryId, url } = req.body
        const isGiftExistWithSameName = await this.giftRecommendationModel.findOne({ giftName, categoryId }).lean().exec()
        if (isGiftExistWithSameName) {
            return response('features.gift.add.alreadyExist', RESPONSE_STATUS_CODES.badRequest, res)
        }
        const createGiftRecommendation = await this.giftRecommendationModel.create({ giftName, categoryId, url })
        return response('features.gift.add.success', RESPONSE_STATUS_CODES.success, res, createGiftRecommendation)
    }

    async updateGiftRecommendation(req: Request, res: any) {
        const { giftName, categoryId, url } = req.body
        const { id } = req.params;
        const isGiftExist = await this.giftRecommendationModel.findById(id)
        if (!isGiftExist) {
            return response('features.gift.add.notExist', RESPONSE_STATUS_CODES.badRequest, res)
        }
        const updateGiftRecommendation = await this.giftRecommendationModel.findByIdAndUpdate(id, { giftName, categoryId, url }, { new: true })
        return response('features.gift.update.success', RESPONSE_STATUS_CODES.success, res, updateGiftRecommendation)
    }

    async deleteGiftRecommendation(req: Request, res: any) {
        const { id } = req.params;
        const deleteGiftRecord = await this.giftRecommendationModel.findByIdAndDelete(id)
        if (!deleteGiftRecord) {
            return response('features.gift.add.notExist', RESPONSE_STATUS_CODES.badRequest, res)
        }
        return response('features.gift.delete', RESPONSE_STATUS_CODES.success, res)
    }

    async listGiftRecommendation(req: any, res: any) {
        const listOfGiftRecommendation = await this.giftRecommendationModel.find({}).populate({
            path: 'categoryId',
            select: 'categoryName'
        })
        return response('features.gift.list.success', RESPONSE_STATUS_CODES.success, res, listOfGiftRecommendation)
    }

    async listOfRecommendationForUser(req: any, res: any) {
        const { reminderId } = req.body
        const getInfoAboutReminder = await this.reminderModel.findById(reminderId).lean().exec();
        if (!getInfoAboutReminder) {
            return response('features.reminder.notFound', RESPONSE_STATUS_CODES.success, res)
        }
        const result = []
        const { genderOfPerson } = getInfoAboutReminder
        const getCategoryListOfGift = await this.giftRecommendationCategoryModel.find({ gender: { $in: [genderOfPerson, ListOfGenderSelectionOptions.other] } }).lean().exec();
        for (let i = 0; i < getCategoryListOfGift.length; i++) {
            const categoryInfo = getCategoryListOfGift[i];
            const getGiftRecommendation = await this.giftRecommendationModel.find({ categoryId: categoryInfo._id }).select('giftName url').lean().exec();
            result.push({
                categoryName: categoryInfo.categoryName,
                giftProducts: getGiftRecommendation
            })
        }
        return response('features.gift.list.success', RESPONSE_STATUS_CODES.success, res, result)
    }
}
