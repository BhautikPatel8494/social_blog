import { Document } from "mongoose";

export interface User extends Document {
  _doc: any;
  readonly _id: string;
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly userType: string;
  readonly contactNumber: string;
  readonly deviceTokens: Array<string>;
  readonly deviceTokenList: Array<DeviceTone>;
  readonly isUserSubscriptionEnable: boolean;
  readonly freeRemindersAvailable: number;
  apiToken: string;
  readonly birthDate: Date;
}

interface DeviceTone {
  deviceToken: string,
  deviceType: string
}

export interface GiftRecommendation extends Document {
  readonly _id: string;
  readonly category: string;
  readonly description: string;
}

export interface GiftRecommendationCategory extends Document {
  readonly _id: string;
  readonly categoryName: string;
}

export interface Occasion extends Document {
  readonly _id: string;
  readonly occationName: string;
  readonly description: string;
}

export interface UserReminder extends Document {
  readonly _id: string;
  readonly occasionDate: string;
  readonly genderOfPerson: number;
  readonly relationsWithPerson: number;
  readonly isNeedToShowGiftRecommendations: boolean;
  readonly remindMeOn: string[];
  readonly isNeedToRepeatEveryYear: boolean;
}

export interface Country extends Document {
  readonly _id: string;
  readonly name: string;
  readonly alias: string;
}





