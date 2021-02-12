import { IsString, IsEmail, MinLength, IsOptional, IsNumber, IsEnum, IsNotEmpty, IsArray } from 'class-validator';

export class UpsertPost {
  @IsString()
  @IsNotEmpty()
  description: string;
}

export class GetSinglePost {
  @IsString()
  @IsNotEmpty()
  postId: string;
}

export class LikeUnlikePost {
  @IsString()
  @IsNotEmpty()
  postId: string;

  @IsNumber()
  @IsNotEmpty()
  @IsEnum([1, 2])
  status: number;
}

export class CommentOnPost {
  @IsString()
  @IsNotEmpty()
  postId: string;

  @IsString()
  @IsNotEmpty()
  comment: string;
}