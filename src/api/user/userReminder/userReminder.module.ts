import { Module } from '@nestjs/common';
import { UserRemindersController } from './userReminder.controller';

@Module({
  controllers: [UserRemindersController],
  providers: []
})
export class UserReminderModule {}
