import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UserModule } from './api/user/user.module';
import { AuthModule } from './api/auth/auth.module';
import { ConfigService } from './config/services/config.service';
import { ConfigModule } from './config/config.module'
import { SharedModule } from './shared/shared.module';
import { GiftModule } from './api/admin/gift/gift.module';
import { OccasionModule } from './api/admin/occasion/occasion.module';
import { CountryModule } from './api/admin/country/country.module';
import { UserReminderModule } from './api/user/userReminder/userReminder.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    SharedModule,
    GiftModule,
    UserReminderModule,
    OccasionModule,
    CountryModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGO_URI'),
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useCreateIndex: true,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
