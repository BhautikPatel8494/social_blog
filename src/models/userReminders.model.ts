import * as mongoose from 'mongoose';
import { ListOfGenderSelectionOptions, ListOfRelationOptions } from '@api/user/userReminder/userReminder.validation';

export const UsersRemindersSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    occasionName: {
        type: String,
        required: true,
    },
    occasionDate: {
        type: Date,
        default: null
    },
    description: {
        type: String,
        default: null,
    },
    genderOfPerson: {
        type: Number,
        enum: Object.values(ListOfGenderSelectionOptions),
        default: ListOfGenderSelectionOptions.other
    },
    relationsWithPerson: {
        type: Number,
        enum: Object.values(ListOfRelationOptions),
        default: ListOfRelationOptions.friends
    },
    isNeedToShowGiftRecommendations: {
        type: Boolean,
        default: true
    },
    remindMeOn: {
        type: Array,
        default: []
    },
    customDate: {
        type: String,
        default: null
    },
    isNeedToRepeatEveryYear: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });
