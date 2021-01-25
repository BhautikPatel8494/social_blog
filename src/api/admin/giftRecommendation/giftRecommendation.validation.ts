import { ListOfGenderSelectionOptions } from '@root/api/user/userReminder/userReminder.validation';
import { IsString, IsEmail, MinLength, IsOptional, IsNumber, IsEnum, IsNotEmpty } from 'class-validator';

export class UpsertGiftCategory {

  @IsString()
  @IsNotEmpty()
  categoryName: string;

  @IsNumber()
  @IsNotEmpty()
  @IsEnum(Object.values(ListOfGenderSelectionOptions))
  gender: number;
}

export class UpsertGiftRecommendation {

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsString()
  @IsNotEmpty()
  giftName: string;

  @IsString()
  @IsNotEmpty()
  url: string;
}

export class ListOfGiftRecommendationForUser {

  @IsString()
  @IsNotEmpty()
  reminderId: string;
}