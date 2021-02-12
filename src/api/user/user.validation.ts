import { IsNotEmpty, IsBoolean, IsString } from 'class-validator';

export class GetSingleUser {

  @IsString()
  @IsNotEmpty()
  userId: string
}