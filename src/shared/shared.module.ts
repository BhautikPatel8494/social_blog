import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '@api/auth/auth.module';
import { UsersSchema } from '@models/user.model';
import { GiftRecommendationSchema } from '@root/models/giftRecommendation.model';
import { GiftRecommendationCategory } from '@root/models/giftRecommendationCategory.model';
import { CountrySchema } from '@models/country.model';
import { OccasionSchema } from '@models/occasion.model';
import { UserService } from '@api/user/user.service';
import { AuthService } from '@api/auth/auth.service'
import { CommonService } from './services/common.service';
import { CountryService } from '@api/admin/country/country.service';
import { GiftService } from '@root/api/admin/giftRecommendation/giftRecommendation.service';
import { OccasionService } from '@api/admin/occasion/occasion.service';
import { UsersRemindersSchema } from '@models/userReminders.model';
import { UserReminderService } from '@root/api/user/userReminder/userReminder.service';
import { NotificationService } from './services/notification.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UsersSchema },
      { name: 'GiftRecommendation', schema: GiftRecommendationSchema },
      { name: 'GiftRecommendationCategory', schema: GiftRecommendationCategory },
      { name: 'Occasion', schema: OccasionSchema },
      { name: 'Country', schema: CountrySchema },
      { name: 'Reminders', schema: UsersRemindersSchema }
    ]),
    AuthModule,
  ],
  providers: [
    AuthService,
    UserService,
    GiftService,
    OccasionService,
    NotificationService,
    UserReminderService,
    CountryService,
    CommonService
  ],
  exports: [
    AuthService,
    UserService,
    GiftService,
    NotificationService,
    UserReminderService,
    OccasionService,
    CountryService,
    CommonService
  ],
})
export class SharedModule { }
