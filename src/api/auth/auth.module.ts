import { Module, HttpModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthService } from './auth.service';
import { JwtDeviceStrategy } from './jwt-device.strategy';
import { AuthDeviceController } from './auth.controller';

import { ConfigService } from '@config/services/config.service';
import { ConfigModule } from '@config/config.module';
import { UsersSchema } from '@models/user.model';


@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt-device' }),
    MongooseModule.forFeature([
      { name: 'User', schema: UsersSchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRATION_DAYS'),
        },
      }),
      inject: [ConfigService],
    }),
    HttpModule,
  ],
  controllers: [AuthDeviceController],
  providers: [AuthService, JwtDeviceStrategy],
  exports: [PassportModule, AuthService, JwtModule],
})
export class AuthModule { }
