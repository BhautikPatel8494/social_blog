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
  apiToken: string;
  readonly birthDate: Date;
}

export interface Gift extends Document {
  readonly _id: string;
  readonly category: string;
  readonly description: string;
}

export interface Occasion extends Document {
  readonly _id: string;
  readonly occationName: string;
  readonly description: string;
}

export interface Country extends Document {
  readonly _id: string;
  readonly name: string;
  readonly alias: string;
}





