import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ConfigService } from '@config/services/config.service';
import { User } from '../interface/model.interface';

@Injectable()
export class CommonService {

    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        @InjectModel('User') private readonly userModel: Model<User>,
    ) { }

    jwtConfig = this.configService.getJWTConfig();

    // This will generate api token for user
    async generateToken(user: User) {
        const { email, _id } = user;
        const payload = {
            _id,
            // email,
        };
        return this.jwtService.sign(payload, this.jwtConfig);
    }


}
