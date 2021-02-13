import { IsNotEmpty, IsBoolean, IsString, IsNumber, IsEnum } from 'class-validator';

export class GetSingleUser {

  @IsString()
  @IsNotEmpty()
  userId: string
}
export class FollowUser {

  @IsString()
  @IsNotEmpty()
  targetUserId: string

  @IsNumber()
  @IsNotEmpty()
  @IsEnum([1, 2])
  status: number;
}