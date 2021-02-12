import { Module } from '@nestjs/common';
import { UserPostController } from './post.controller';

@Module({
  controllers: [UserPostController],
  providers: []
})
export class UserPostModule {}
