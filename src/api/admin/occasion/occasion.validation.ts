import { IsString, IsEmail, MinLength, IsOptional, IsNumber, IsEnum, IsNotEmpty } from 'class-validator';

export class UpsertOccasion {

  @IsString()
  @IsNotEmpty()
  occasionName: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  countryId: string;
}