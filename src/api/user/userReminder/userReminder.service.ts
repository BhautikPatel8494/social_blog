import { Injectable, OnModuleInit } from '@nestjs/common';
import { Response, Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CronJob } from 'cron';
import moment, { Moment } from 'moment'
import * as _ from 'lodash'
import { scheduleJob } from 'node-schedule'

import { Occasion, User, UserReminder } from '@shared/interface/model.interface';
import { response } from '@root/shared/services/sendResponse.service';
import { RESPONSE_STATUS_CODES } from '@root/shared/constants';
import { ListOfReminderOptions } from './userReminder.validation';
import { NotificationService } from '@shared/services/notification.service';
import { add } from 'lodash';

const userSetCronJobList = {}

@Injectable()
export class UserReminderService implements OnModuleInit {

    constructor(
        @InjectModel('Reminders') private readonly reminderModel: Model<UserReminder>,
        @InjectModel('Occasion') private readonly occasionModel: Model<Occasion>,
        @InjectModel('User') private readonly userModel: Model<User>,
        private readonly notificationService: NotificationService,
    ) { }

    async createReminder(req: any, res: Response) {
        const { _id: id } = req.user;
        const { remindMeOn, customDate, occasionDate, isNeedToRepeatEveryYear } = req.body;
        if (!isNeedToRepeatEveryYear && moment().diff(moment(occasionDate, 'DD/MM/YYYY')) >= 0) {
            return response('features.reminder.timeIsInPast', RESPONSE_STATUS_CODES.badRequest, res)
        }
        if (!req.user.isUserSubscriptionEnable && req.user.freeRemindersAvailable < remindMeOn.length) {
            return response('features.reminder.outOfFreeReminder', RESPONSE_STATUS_CODES.badRequest, res)
        }
        if (!req.user.isUserSubscriptionEnable) {
            const updateFreeReminderCount = req.user.freeRemindersAvailable - remindMeOn.length
            await this.userModel.findByIdAndUpdate(id, { freeRemindersAvailable: updateFreeReminderCount })
        }
        req.body.userId = id
        const createUserReminderInTable = await this.reminderModel.create(req.body);
        const setReminderParamters = { id, remindMeOn, occasionDate, customDate, isNeedToRepeatEveryYear }
        await this.setReminderCronJob(id, createUserReminderInTable._id, setReminderParamters)
        return response('features.reminder.create', RESPONSE_STATUS_CODES.success, res, createUserReminderInTable)
    }

    async updateReminder(req: any, res: Response) {
        const { id } = req.params
        const userId = req.user._id
        const { remindMeOn, isNeedToRepeatEveryYear, occasionDate } = req.body
        const isReminderAvailable = await this.reminderModel.findOne({ _id: id, userId }).lean().exec()
        const valueOfRepeatYear = isNeedToRepeatEveryYear ? isNeedToRepeatEveryYear : isReminderAvailable.isNeedToRepeatEveryYear
        if (occasionDate && !valueOfRepeatYear && moment().diff(moment(occasionDate, 'DD/MM/YYYY')) >= 0) {
            return response('features.reminder.timeIsInPast', RESPONSE_STATUS_CODES.badRequest, res)
        }
        if (!isReminderAvailable) {
            return response('features.reminder.notFound', RESPONSE_STATUS_CODES.notFound, res)
        }
        if (remindMeOn && _.difference(isReminderAvailable.remindMeOn.length, remindMeOn.length).length) {
            const currentFreeReminder = req.user.freeRemindersAvailable + isReminderAvailable.remindMeOn.length;
            if (currentFreeReminder < remindMeOn.length) {
                return response('features.reminder.outOfFreeReminder', RESPONSE_STATUS_CODES.badRequest, res)
            } else {
                const setReminderParamters = { ...isReminderAvailable, ...req.body }
                this.deleteOldCronJobForRemidner(id)
                await this.setReminderCronJob(userId, id, setReminderParamters)
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
        this.deleteOldCronJobForRemidner(id)
        await this.reminderModel.findByIdAndDelete(id);
        return response('features.reminder.deleted', RESPONSE_STATUS_CODES.success, res)
    }

    async getListOfReminders(req: any, res: Response) {
        const userId = req.user._id
        const listOfReminderForLoginUser = await this.reminderModel.find({ userId }).lean().exec()
        const reminderForToday = []
        const reminderForTomorrow = []
        const reminderForUpcommingDays = []
        for (let i = 0; i < listOfReminderForLoginUser.length; i++) {
            let reminderInfo = listOfReminderForLoginUser[i];
            if (!reminderInfo.isNeedToRepeatEveryYear && moment().diff(moment(reminderInfo.occasionDate, 'DD/MM/YYYY'), 'day') > 0) {
                this.deleteOldCronJobForRemidner(reminderInfo._id)
                await this.reminderModel.findByIdAndDelete(reminderInfo._id)
            } else {
                let occasionDateInMoment = moment(reminderInfo.occasionDate, 'DD/MM/YYYY').set({ year: new Date().getFullYear() })
                if (moment().diff(occasionDateInMoment, 'days') > 0) {
                    occasionDateInMoment = occasionDateInMoment.add({ year: 1 })
                }
                reminderInfo.occasionDate = occasionDateInMoment.format('DD/MM/YYYY')
                const getOcaasionInfo = await this.occasionModel.findOne({ occasionName: reminderInfo.occasionName }).select('occasionImage').lean().exec();
                reminderInfo.occasionImage = getOcaasionInfo.occasionImage ? getOcaasionInfo.occasionImage : null;
                const isTodayReminder = moment().diff(occasionDateInMoment) > 0
                const isTomorrowReminder = moment().add(1, 'day').diff(occasionDateInMoment) > 0
                if (isTodayReminder) {
                    reminderForToday.push(reminderInfo)
                } else if (isTomorrowReminder) {
                    reminderForTomorrow.push(reminderInfo)
                } else {
                    reminderForUpcommingDays.push(reminderInfo)
                }
            }
        }
        return response('features.reminder.listGet', RESPONSE_STATUS_CODES.success, res, { reminderForToday, reminderForTomorrow, reminderForUpcommingDays })
    }

    async setReminderCronJob(userId: string, reminderId: string, setReminderParamters) {
        const { id, remindMeOn, occasionDate, customDate, isNeedToRepeatEveryYear } = setReminderParamters
        if (remindMeOn.includes(ListOfReminderOptions.onTheDay)) {
            let timeRule: string | Date = ''
            if (isNeedToRepeatEveryYear) {
                const [date, month] = occasionDate.split('/')
                timeRule = `0 0 0 ${date} ${month} *`
            } else {
                timeRule = moment(occasionDate, 'DD/MM/YYYY').toDate()
            }
            userSetCronJobList[`${reminderId}-1`] = scheduleJob(timeRule, async () => {
                await this.sendNotificationToDevice(userId)
            })
        }
        if (remindMeOn.includes(ListOfReminderOptions.oneDayBefore)) {
            let timeRule: string | Date = ''
            if (isNeedToRepeatEveryYear) {
                const updatedMomentTime = moment(occasionDate, 'DD/MM/YYYY').subtract(1, 'day').format('DD/MM/YYYY')
                const [date, month] = updatedMomentTime.split('/')
                timeRule = `0 0 0 ${date} ${month} *`
            } else {
                timeRule = moment(occasionDate, 'DD/MM/YYYY').subtract(1, 'day').toDate();
            }
            userSetCronJobList[`${reminderId}-2`] = scheduleJob(timeRule, async () => {
                await this.sendNotificationToDevice(userId)
            })
        }
        if (remindMeOn.includes(ListOfReminderOptions.oneMonthBefore)) {
            let timeRule: string | Date = ''
            if (isNeedToRepeatEveryYear) {
                const updatedMomentTime = moment(occasionDate, 'DD/MM/YYYY').subtract(1, 'month').format('DD/MM/YYYY')
                const [date, month] = updatedMomentTime.split('/')
                timeRule = `0 0 0 ${date} ${month} *`
            } else {
                timeRule = moment(occasionDate, 'DD/MM/YYYY').subtract(1, 'month').toDate();
            }
            userSetCronJobList[`${reminderId}-3`] = scheduleJob(timeRule, async () => {
                await this.sendNotificationToDevice(userId)
            })
        }
        if (remindMeOn.includes(ListOfReminderOptions.oneWeekBefore)) {
            let timeRule: string | Date = ''
            if (isNeedToRepeatEveryYear) {
                const updatedMomentTime = moment(occasionDate, 'DD/MM/YYYY').subtract(1, 'week').format('DD/MM/YYYY')
                const [date, month] = updatedMomentTime.split('/')
                timeRule = `0 0 0 ${date} ${month} *`
            } else {
                timeRule = moment(occasionDate, 'DD/MM/YYYY').subtract(1, 'week').toDate();
            }
            userSetCronJobList[`${reminderId}-4`] = scheduleJob(timeRule, async () => {
                await this.sendNotificationToDevice(userId)
            })
        }
        if (remindMeOn.includes(ListOfReminderOptions.custom)) {
            let timeRule: string | Date = ''
            if (isNeedToRepeatEveryYear) {
                const [date, month] = customDate.split('/')
                timeRule = `0 0 0 ${date} ${month} *`
            } else {
                timeRule = moment(customDate, 'DD/MM/YYYY').toDate();
            }
            userSetCronJobList[`${reminderId}-5`] = scheduleJob(timeRule, async () => {
                await this.sendNotificationToDevice(userId)
            })
        }
        return true;
    }

    async sendNotificationToDevice(id: string) {
        console.log(`CronJob Started for user ${id}`)
        const { deviceTokenList } = await this.userModel.findById(id)
        if (deviceTokenList?.length) {
            for (let i = 0; i < deviceTokenList.length; i++) {
                const { deviceToken } = deviceTokenList[i];
                await this.notificationService.sendPushNotification(deviceToken, 'Reminder App notification', 'New notification from reminder app')
            }
        }
        return true;
    }

    deleteOldCronJobForRemidner(id: string) {
        for (const key in userSetCronJobList) {
            if (key.includes(id)) {
                userSetCronJobList[key].stop()
                delete userSetCronJobList[key]
            }
        }
        return true;
    }

    async onModuleInit() {
        const getListOfReminders = await this.reminderModel.find({});
        for (let i = 0; i < getListOfReminders.length; i++) {
            const reminderOptions = getListOfReminders[i];
            console.log(`Reminder CronJob set for reminderId ${reminderOptions._id}`)
            await this.setReminderCronJob(reminderOptions.userId, reminderOptions._id, reminderOptions)
        }
        return true;
    }
}
