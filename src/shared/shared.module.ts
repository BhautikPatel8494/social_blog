import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../api/auth/auth.module';
import { UsersSchema } from '../models/user.model';
import { GiftSchema } from '../models/gift.model';
import { CountrySchema } from '../models/country.model';
import { OccasionSchema } from '../models/occasion.model';
import { UserService } from '../api/user/user.service';
import { AuthService } from '../api/auth/auth.service'
import { CommonService } from './services/common.service';
import { CountryService } from '../api/admin/country/country.service';
import { GiftService } from '../api/admin/gift/gift.service';
import { OccasionService } from '../api/admin/occasion/occasion.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UsersSchema },
      { name: 'Gift', schema: GiftSchema },
      { name: 'Occasion', schema: OccasionSchema },
      { name: 'Country', schema: CountrySchema }
    ]),
    AuthModule,
  ],
  providers: [
    AuthService,
    UserService,
    GiftService,
    OccasionService,
    CountryService,
    CommonService
  ],
  exports: [
    AuthService,
    UserService,
    GiftService,
    OccasionService,
    CountryService,
    CommonService
  ],
})
export class SharedModule { }
