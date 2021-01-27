import { Injectable } from '@nestjs/common';
import { Response, Request } from 'express';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { RESPONSE_STATUS_CODES } from '@shared/constants';
import { User } from '@shared/interface/model.interface';
import { response } from '@shared/services/sendResponse.service';
import { CommonService } from '@shared/services/common.service';

@Injectable()
export class UserService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
        private readonly commonService: CommonService,
    ) { }

    async getLogedInUserInfo(req: any, res: Response) {
        const getUserInfo = await this.userModel.findById(req.user._id).select('-password -deviceTokenList').lean().exec();
        return response('user.auth.getUserInfo.success', RESPONSE_STATUS_CODES.success, res, getUserInfo)
    }

    async changeSubscriptionStatus(req: any, res: Response) {
        const { isUserSubscriptionEnable } = req.body;
        await this.userModel.findByIdAndUpdate(req.user._id, { isUserSubscriptionEnable });
        return response('user.subscriptionStatus.changed', RESPONSE_STATUS_CODES.success, res)
    }

    async updateUserProfile(file: any, req: any, res: Response) {
        const updatedInfo = req.body;
        if (file && file.profilePicture && file.profilePicture.length) {
            const uploadImage = await this.commonService.manageUploadImage(file, 'profilePicture', res)
            updatedInfo.profilePicture = uploadImage;
        }
        await this.userModel.findByIdAndUpdate(req.user._id, updatedInfo);
        return response('user.profile.updated', RESPONSE_STATUS_CODES.success, res)
    }

}
