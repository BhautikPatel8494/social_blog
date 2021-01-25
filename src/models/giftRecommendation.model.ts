import { ListOfGenderSelectionOptions } from '@root/api/user/userReminder/userReminder.validation';
import * as mongoose from 'mongoose';

export const GiftRecommendationSchema = new mongoose.Schema({
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GiftRecommendationCategory',
        requried: true
    },
    giftName: {
        type: String,
        requried: true
    },
    url: {
        type: String,
        requried: true
    }
}, { timestamps: true });
