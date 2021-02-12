import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UserModule } from '@api/user/user.module';
import { AuthModule } from 'api/auth/auth.module';
import { ConfigService } from '@config/services/config.service';
import { ConfigModule } from '@config/config.module'
import { SharedModule } from '@shared/shared.module';
import { UserPostModule } from '@root/api/user/post/post.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    SharedModule,
    UserPostModule,
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
