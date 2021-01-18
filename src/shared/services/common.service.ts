import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '../../config/services/config.service';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../interface/model.interface';
import { AuthService } from 'src/api/auth/auth.service';

@Injectable()
export class CommonService {

    constructor(
        // @Inject(forwardRef(() => AuthService))
        // private readonly authService: AuthService,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        @InjectModel('User') private readonly userModel: Model<User>,
    ) {}

    jwtConfig = this.configService.getJWTConfig();

    // This will generate api token for user
    async generateToken(user: { [key: string]: any }) {
        try {
            const { email, _id } = user;
            const payload = {
                _id,
                email,
            };
            return this.jwtService.sign(payload, this.jwtConfig);
        } catch (error) {
            Logger.error('Error while generating token', error);
            return null;
        }
    }

   
}
