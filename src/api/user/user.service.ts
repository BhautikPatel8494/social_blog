import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RESPONSE_STATUS_CODES } from '../../shared/constants';
import { User } from '../../shared/interface/model.interface';
import { response } from '../../shared/services/sendResponse.service';
import { Response, Request } from 'express';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
    ) { }

    async changeSubscriptionStatus(req: any, res: Response) {
        const { isUserSubscriptionEnable } = req.body;
        await this.userModel.findByIdAndUpdate(req.user._id, { isUserSubscriptionEnable });
        return response('user.subscriptionStatus.changed', RESPONSE_STATUS_CODES.success, res)
    }

    async updateUserProfile(req: any, res: Response) {
        const { isUserSubscriptionEnable } = req.body;
        await this.userModel.findByIdAndUpdate(req.user._id, { isUserSubscriptionEnable });
        return response('user.subscriptionStatus.changed', RESPONSE_STATUS_CODES.success, res)
    }

}
