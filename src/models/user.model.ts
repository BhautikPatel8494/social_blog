import * as mongoose from 'mongoose';
export const UserTypes = {
    user: 'User',
    admin: 'Admin'
}

export const SocialMediaTypes = {
    facebook: 'Facebook',
    appleId: 'AppleId',
    linkedIn: 'LinkedIn',
    twitter: 'Twitter',
    google: 'Google'
}

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
        default: UserTypes.user,
        enum: Object.values(UserTypes),
    },
    apiToken: {
        type: String,
        default: null,
    },
    contactNumber: {
        type: String,
        default: null,
    },
    deviceTokens: [{
        type: String,
        default: [],
    }],
    birthDate:
    {
        type: String,
        default: null,
    },
    socialMediaType: {
        type: String,
        default: null,
        enum: Object.values(SocialMediaTypes),
    },
    socialMediaId: {
        type: String,
        default: null,
    }
}, { timestamps: true });
