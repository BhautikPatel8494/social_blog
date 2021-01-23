import * as mongoose from 'mongoose';

export const OccasionSchema = new mongoose.Schema({
    occasionName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: null
    },
    occasionImage: {
        type: String,
        default: null
    },
    countryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country',
        default: null
    }
}, { timestamps: true });
