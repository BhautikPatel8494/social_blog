import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
const firebase = require('./firebaseKey');

import * as admin from "firebase-admin";
import moment from 'moment'
import { Model } from 'mongoose';
import { ObjectLiteral } from '../interface/common.interface';
import { Occasion } from '../interface/model.interface';

// Initialize Firebase
admin.initializeApp({
    credential: admin.credential.cert({ ...firebase.firebase })
});

@Injectable()
export class NotificationService {
    constructor(
        @InjectModel('Occasion') private readonly occasionModel: Model<Occasion>,
    ) { }

    async sendPushNotification(tokens: any, title: string, message: string, extraInfo: ObjectLiteral) {
        if (extraInfo) {
            let occasionDateInMoment = moment(extraInfo.occasionDate, 'DD/MM/YYYY').set({ year: new Date().getFullYear() })
            if (moment().diff(occasionDateInMoment, 'days') > 0) {
                occasionDateInMoment = occasionDateInMoment.add({ year: 1 })
            }
            extraInfo.titleOfReminder = message
            extraInfo.occasionDate = occasionDateInMoment.format('DD/MM/YYYY')
            const getOcaasionInfo = await this.occasionModel.findOne({ occasionName: extraInfo.occasionName }).select('occasionImage').lean().exec();
            if (getOcaasionInfo) {
                extraInfo.occasionImage = getOcaasionInfo.occasionImage ? getOcaasionInfo.occasionImage : null;
            }
        }
        const messageObj = {
            tokens: tokens,
            notification: {
                title: title,
                body: message,
            },
            data: {
                reminderInfo: JSON.stringify(extraInfo)
            }
        }
        if (tokens && tokens.length) {
            admin.messaging().sendMulticast(messageObj)
                .then((response) => {
                    if (response.failureCount > 0) {
                        const failedTokens = [];
                        response.responses.forEach((resp, idx) => {
                            if (!resp.success) {
                                failedTokens.push(tokens[idx]);
                            }
                        });
                        console.log('List of tokens that caused failures: ' + failedTokens);
                    } else {
                        console.log("====================================");
                        console.log("Sucsessfully send ");
                        console.log("====================================");
                    }
                }).catch((e) => {
                    console.log('\n error : ', e);
                });
        }
        return true;
    }
}