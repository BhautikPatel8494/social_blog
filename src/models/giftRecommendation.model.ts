import * as mongoose from 'mongoose';

export const GiftRecommendationSchema = new mongoose.Schema({
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GiftRecommendation',
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
