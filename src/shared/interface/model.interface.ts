import { Document } from "mongoose";

export interface User extends Document {
  _doc: any;
  readonly _id: string;
  readonly name: string;
  readonly email: string;
  readonly password: string;
  apiToken: string;
}
export interface UserPost extends Document {
  readonly _id: string;
  readonly occationName: string;
  readonly description: string;
}

export interface LikeDislikeModel extends Document {
  readonly _id: string;
  readonly userId: string;
  readonly postId: string;
}

export interface FollowerModel extends Document {
  readonly _id: string;
  readonly userId: string;
  readonly targetUserId: string;
}

export interface CommentModel extends Document {
  readonly _id: string;
  readonly userId: string;
  readonly postId: string;
  readonly comment: string;
}




