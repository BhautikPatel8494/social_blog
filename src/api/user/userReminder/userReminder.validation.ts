import { IsString, IsEmail, MinLength, IsOptional, IsNumber, IsEnum, IsNotEmpty, IsDate, IsBoolean, IsArray } from 'class-validator';

export const ListOfGenderSelectionOptions = {
  male: 1,
  female: 2,
  couple: 3,
  other: 4
}

export const ListOfRelationOptions = {
  friends: 1,
  family: 2,
  work: 3,
}

export const ListOfReminderOptions = {
  onTheDay: 1,
  oneDayBefore: 2,
  oneWeekBefore: 3,
  oneMonthBefore: 4,
  custom: 5
}

export class InsertReminder {

  @IsString()
  @IsNotEmpty()
  occasionName: string;

  @IsString()
  @IsNotEmpty()
  occasionDate: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsEnum(Object.values(ListOfGenderSelectionOptions))
  @IsNotEmpty()
  genderOfPerson: number;

  @IsEnum(Object.values(ListOfRelationOptions))
  @IsNotEmpty()
  relationsWithPerson: number;

  @IsBoolean()
  @IsOptional()
  isNeedToShowGiftRecommendations: boolean;

  @IsArray()
  @IsOptional()
  remindMeOn: number[];

  @IsString()
  @IsOptional()
  customDate: string;

  @IsBoolean()
  @IsOptional()
  isNeedToRepeatEveryYear: boolean
}

export class UpdateReminder {

  @IsString()
  @IsOptional()
  occasionName: string;

  @IsString()
  @IsOptional()
  occasionDate: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsEnum(Object.values(ListOfGenderSelectionOptions))
  @IsOptional()
  genderOfPerson: number;

  @IsEnum(Object.values(ListOfRelationOptions))
  @IsOptional()
  relationsWithPerson: number;

  @IsBoolean()
  @IsOptional()
  isNeedToShowGiftRecommendations: boolean;

  @IsArray()
  @IsOptional()
  remindMeOn: number[];

  @IsString()
  @IsOptional()
  customDate: string;

  @IsBoolean()
  @IsOptional()
  isNeedToRepeatEveryYear: boolean
}