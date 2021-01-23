import { Injectable } from '@nestjs/common';
import { Response, Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UserReminder } from '@shared/interface/model.interface';
import { response } from '@root/shared/services/sendResponse.service';
import { RESPONSE_STATUS_CODES } from '@root/shared/constants';

@Injectable()
export class UserReminderService {

    constructor(
        @InjectModel('Reminders') private readonly reminderModel: Model<UserReminder>,
    ) { }

    async createReminder(req: any, res: Response) {
        req.body.userId = req.user._id
        const createUserReminderInTable = await this.reminderModel.create(req.body);
        return response('features.reminder.create', RESPONSE_STATUS_CODES.success, res, createUserReminderInTable)
    }

    async updateReminder(req: any, res: Response) {
        const { id } = req.params
        const userId = req.user._id
        const isReminderAvailable = await this.reminderModel.findOne({ _id: id, userId }).lean().exec()
        if (!isReminderAvailable) {
            return response('features.reminder.notFound', RESPONSE_STATUS_CODES.notFound, res)
        }
        const updateUserReminder = await this.reminderModel.findByIdAndUpdate(id, req.body, { new: true });
        return response('features.country.updated', RESPONSE_STATUS_CODES.success, res, updateUserReminder)
    }

    async deleteReminder(req: any, res: Response) {
        const { id } = req.params
        const userId = req.user._id
        const isReminderAvailable = await this.reminderModel.findOne({ _id: id, userId }).lean().exec()
        if (!isReminderAvailable) {
            return response('features.reminder.notFound', RESPONSE_STATUS_CODES.notFound, res)
        }
        await this.reminderModel.findByIdAndDelete(id);
        return response('features.reminder.deleted', RESPONSE_STATUS_CODES.success, res)
    }

    async getListOfReminders(req: any, res: Response) {
        const userId = req.user._id
        const listOfReminderForLoginUser = await this.reminderModel.find({ userId }).lean().exec()
        return response('features.reminder.listGet', RESPONSE_STATUS_CODES.success, res, listOfReminderForLoginUser)
    }
}
