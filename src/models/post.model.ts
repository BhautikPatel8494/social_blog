import * as mongoose from 'mongoose';

export const UserPostSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    postImage: {
        type: String,
        default: null
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });
