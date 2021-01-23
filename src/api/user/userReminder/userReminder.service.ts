import { Injectable } from '@nestjs/common';
import { Response, Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserReminder } from '../../../shared/interface/model.interface';
import { response } from '../../../shared/services/sendResponse.service';
import { RESPONSE_STATUS_CODES } from '../../../shared/constants';

@Injectable()
export class UserReminderService {

    constructor(
        @InjectModel('Reminders') private readonly reminderModel: Model<UserReminder>,
        @InjectModel('User') private readonly userModel: Model<User>,
    ) { }

    async createReminder(req: any, res: Response) {
        const { _id: id } = req.user;
        const { remindMeOn } = req.body;
        if (!req.user.isUserSubscriptionEnable && req.user.freeRemindersAvailable < remindMeOn.length) {
            return response('features.reminder.outOfFreeReminder', RESPONSE_STATUS_CODES.badRequest, res)
        }
        if (!req.user.isUserSubscriptionEnable) {
            const updateFreeReminderCount = req.user.freeRemindersAvailable - remindMeOn.length
            await this.userModel.findByIdAndUpdate(id, { freeRemindersAvailable: updateFreeReminderCount })
        }
        req.body.userId = id
        const createUserReminderInTable = await this.reminderModel.create(req.body);
        return response('features.reminder.create', RESPONSE_STATUS_CODES.success, res, createUserReminderInTable)
    }

    async updateReminder(req: any, res: Response) {
        const { id } = req.params
        const userId = req.user._id
        const { remindMeOn } = req.body
        const isReminderAvailable = await this.reminderModel.findOne({ _id: id, userId }).lean().exec()
        if (!isReminderAvailable) {
            return response('features.reminder.notFound', RESPONSE_STATUS_CODES.notFound, res)
        }
        if (isReminderAvailable.remindMeOn.length !== remindMeOn.length) {
            const currentFreeReminder = req.user.freeRemindersAvailable + isReminderAvailable.remindMeOn.length;
            if (currentFreeReminder < remindMeOn.length) {
            } else {
                const updateFreeReminderCount = currentFreeReminder - remindMeOn.length
                await this.userModel.findByIdAndUpdate(userId, { freeRemindersAvailable: updateFreeReminderCount })
            }
        }
        const updateUserReminder = await this.reminderModel.findByIdAndUpdate(id, req.body, { new: true });
        return response('features.reminder.updated', RESPONSE_STATUS_CODES.success, res, updateUserReminder)
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

    async updateUserFreeReminderStatus() {

    }
}
