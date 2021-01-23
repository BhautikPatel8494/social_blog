import { IsNotEmpty, IsBoolean } from 'class-validator';

export class ChangeSubscriptionStatus {

  @IsBoolean()
  @IsNotEmpty()
  isUserSubscriptionEnable: boolean
}