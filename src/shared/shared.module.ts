import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '@api/auth/auth.module';
import { UsersSchema } from '@models/user.model';
import { UserPostSchema } from '@root/models/post.model';
import { LikeDislikeSchema } from '@root/models/like.model';
import { UserService } from '@api/user/user.service';
import { AuthService } from '@api/auth/auth.service'
import { CommonService } from './services/common.service';
import { UserPostService } from '@root/api/user/post/post.service';
import { CommentSchema } from '@root/models/comment.model';
import { FollowersModel } from '@root/models/followers.model';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UsersSchema },
      { name: 'UserPost', schema: UserPostSchema },
      { name: 'LikeDislike', schema: UserPostSchema },
      { name: 'Comment', schema: CommentSchema },
      { name: 'Followers', schema: FollowersModel }
    ]),
    AuthModule,
  ],
  providers: [
    AuthService,
    UserService,
    UserPostService,
    CommonService
  ],
  exports: [
    AuthService,
    UserService,
    UserPostService,
    CommonService
  ],
})
export class SharedModule { }
