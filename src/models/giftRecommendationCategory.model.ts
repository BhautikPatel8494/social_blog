import * as mongoose from 'mongoose';

export const GiftRecommendationCategory = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true,
    }
}, { timestamps: true });
