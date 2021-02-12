const cloudinary = require('cloudinary').v2;
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response } from 'express';

import { ConfigService } from '@config/services/config.service';
import { User } from '../interface/model.interface';
cloudinary.config({
    cloud_name: 'dcax1z817',
    api_key: '276495167163333',
    api_secret: 'wvEYrVV1NkcqlY3ECh6gvv-gS1Y'
});

@Injectable()
export class CommonService {

    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        @InjectModel('User') private readonly userModel: Model<User>,
    ) { }

    jwtConfig = this.configService.getJWTConfig();
    serverURL = this.configService.get('SERVER_URL');
    environment = this.configService.get('NODE_ENV');

    // This will generate api token for user
    async generateToken(user: User) {
        const { email, _id } = user;
        const payload = {
            _id,
            // email,
        };
        return this.jwtService.sign(payload, this.jwtConfig);
    }

    async manageUploadImage(file: any, keyName: String, res: Response) {
        file[`${keyName}`][0].filename = file[`${keyName}`][0].filename.toLowerCase();
        const allowedFiles = [".jpg", ".jpeg", ".png"];
        const regex = new RegExp("([a-zA-Z0-9\s_\\.\-:])+(" + allowedFiles.join('|') + ")$");
        if (!regex.test(file[`${keyName}`][0].filename)) {
            return res.json({ statusCode: 400, message: 'Invalid file type. Please upload image file.', data: null });
        }
        let path = file[`${keyName}`][0].path;
        path = path.replace('upload/', '');
        if (this.environment === 'staging') {
            const imageFile = file[`${keyName}`][0]['path'];
            const imageData = await cloudinary.uploader.upload(imageFile, { tags: keyName });
            return imageData.secure_url
        } else {
            return path;
        }
    }
}
