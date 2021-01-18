
import { Module, Global,forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../api/auth/auth.module';

import { UsersSchema } from '../models/user.model';
import { GiftSchema } from '../models/gift.model';
import { CountrySchema } from '../models/country.model';
import { OccasionSchema } from '../models/occasion.model';


import { UserService } from '../api/user/user.service';

import { AuthService } from '../api/auth/auth.service'
import {CommonService} from './services/common.service';


@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UsersSchema },
      { name: 'Gift', schema: GiftSchema},
      { name: 'Occasion', schema: OccasionSchema },
      { name: 'Country', schema: CountrySchema }
    ]),
    AuthModule,
    // forwardRef(()=>AuthModule)
  ],
  providers: [
    AuthService,
    UserService,,
    CommonService
  ],
  exports: [
    AuthService,
    UserService,
    CommonService
  ],
})
export class SharedModule { }
