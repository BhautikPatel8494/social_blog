import { Injectable } from '@nestjs/common';
import { Response, Request } from 'express';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { RESPONSE_STATUS_CODES } from '@shared/constants';
import { User } from '@shared/interface/model.interface';
import { response } from '@shared/services/sendResponse.service';
@Injectable()
export class UserService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
    ) { }

    async getAllUserInfo(req: any, res: Response) {
        const getUserInfo = await this.userModel.find({}).select('email name').lean().exec();
        return response('user.auth.getUserInfo.success', RESPONSE_STATUS_CODES.success, res, getUserInfo)
    }

    async getUserInfo(req: any, res: Response) {
        const { userId } = req.body
        const userInfo = await this.userModel.findById(userId).select('email name').lean().exec();
        if (!userInfo) {
            return response('common.userNotFound', RESPONSE_STATUS_CODES.notFound, res, userInfo)
        }
        return response('user.auth.getUserInfo.success', RESPONSE_STATUS_CODES.success, res, userInfo)
    }

}
