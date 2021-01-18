import { Injectable } from '@nestjs/common';
import { Gift } from 'src/shared/interface/model.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class GiftService {

    constructor(
        @InjectModel('Gift') private readonly giftModel: Model<Gift>,
    ) { }


    async addGift(req: any, res: any) {


    }

    async updateGiftDetails(req: any, res: any) {

    }

    async deleteGiftDetails(req: any, res: any) {


    }

    async listGiftDetauls(req: any, res: any) {

    }
}
