import * as mongoose from 'mongoose';

export const OccasionSchema = new mongoose.Schema({
    occasionName: {
        type: String,
        required: true,
    },
    description:
    {
        type: String
    }

}, { timestamps: true });
