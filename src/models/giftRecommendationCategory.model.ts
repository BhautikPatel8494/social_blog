import { ListOfGenderSelectionOptions } from '@root/api/user/userReminder/userReminder.validation';
import * as mongoose from 'mongoose';

export const GiftRecommendationCategory = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true,
    },
    gender: {
        type: Number,
        enum: Object.values(ListOfGenderSelectionOptions),
        required: true,
    }
}, { timestamps: true });
