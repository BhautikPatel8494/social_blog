import * as mongoose from 'mongoose';

export const UsersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        default: null,
        required: true,
    },
    userType: {
        type: String,
        required: true,
        default: 'User',
        enum: ['User', 'Admin'],
    },
    token: {
        type: String,
        default: null,
    },
    contactNumber:
    {
        type: String
    },
    deviceTokens: [{ type: String }],
    birthDate:
    {
        type: Date
    }
}, { timestamps: true });
