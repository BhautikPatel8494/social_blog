import { IsString, IsEmail, MinLength, IsOptional, IsNumber, IsEnum, IsNotEmpty } from 'class-validator';

export class UpsertGiftCategory {

  @IsString()
  @IsNotEmpty()
  categoryName: string;
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