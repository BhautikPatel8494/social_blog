import * as mongoose from 'mongoose';

export const GiftSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: null,
    }
}, { timestamps: true });
