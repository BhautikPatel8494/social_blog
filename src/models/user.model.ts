import * as mongoose from 'mongoose';
export const UserTypes = {
    user: 'User',
    admin: 'Admin'
}

export const SocialMediaTypes = {
    facebook: 1,
    appleId: 2,
    linkedIn: 3,
    twitter: 4,
    google: 5
}

export const UsersSchema = new mongoose.Schema({
    name: {
        type: String,
        default: null,
    },
    email: {
        type: String,
        default: null
    },
    password: {
        type: String,
        default: null,
    },
    profilePicture: {
        type: String,
        default: null,
    },
    countryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country',
        default: null
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
    birthDate: {
        type: String,
        default: null,
    },
    resetPasswordCode: {
        type: Number,
        default: null,
    },
    socialMediaType: {
        type: Number,
        default: 0,
        enum: [0, ...Object.values(SocialMediaTypes)],
    },
    socialMediaId: {
        type: String,
        default: null,
    },
    deviceTokenList: [{
        deviceType: String,
        deviceToken: String
    }],
    isUserSubscriptionEnable: {
        type: Boolean,
        default: false
    },
    freeRemindersAvailable: {
        type: Number,
        default: 50
    }
}, { timestamps: true });
