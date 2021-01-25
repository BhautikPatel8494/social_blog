import { Injectable } from '@nestjs/common';
import * as admin from "firebase-admin";
const firebase = require('./firebaseKey');

// Initialize Firebase
admin.initializeApp({
    credential: admin.credential.cert({ ...firebase.firebase })
});

@Injectable()
export class NotificationService {
    constructor(
    ) { }

    async sendPushNotification(tokens: any, title: string, message: string) {
        const messageObj = {
            tokens: [tokens],
            notification: {
                title: title,
                body: message,
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