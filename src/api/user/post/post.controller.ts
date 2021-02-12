import { Controller, Req, Res, Post, Get, Delete, Put, HttpCode, UseGuards, ValidationPipe, Body, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { AuthGuard } from "@nestjs/passport";
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerUpload } from '@root/config/services/fileUpload.service';
import { Response, Request } from 'express';

import { UserPostService } from './post.service'
import { UpsertPost, GetSinglePost, LikeUnlikePost, CommentOnPost } from './post.validation'

@Controller('api/v1/post')
export class UserPostController {

    constructor(
        private readonly occasionService: UserPostService,
    ) { }

    @Post('/single-post')
    @HttpCode(200)
    @UseGuards(AuthGuard("jwt-device"))
    async getSinglePost(@Body(new ValidationPipe()) data: GetSinglePost, @Req() req: Request, @Res() res: Response) {
        return await this.occasionService.getSinglePost(req, res);
    }

    @Get('/')
    @HttpCode(200)
    async getAllPost(@Req() req: Request, @Res() res: Response) {
        return await this.occasionService.getAllPost(req, res);
    }

    @Post('/')
    @HttpCode(200)
    @UseGuards(AuthGuard("jwt-device"))
    @UseInterceptors(
        FileFieldsInterceptor([
            {
                name: 'postImage',
                maxCount: 1,
            }
        ], multerUpload({ destination: 'postImage' })),
    )
    async createUserPost(@UploadedFiles() files: { [key: string]: any }, @Body(new ValidationPipe()) data: UpsertPost, @Req() req: Request, @Res() res: Response) {
        return await this.occasionService.createUserPost(files, req, res);
    }

    @Put('/:id')
    @HttpCode(200)
    @UseGuards(AuthGuard("jwt-device"))
    @UseInterceptors(
        FileFieldsInterceptor([
            {
                name: 'postImage',
                maxCount: 1,
            }
        ], multerUpload({ destination: 'postImage' })),
    )
    async updatePostInfo(@UploadedFiles() files: { [key: string]: any }, @Body(new ValidationPipe()) data: UpsertPost, @Req() req: Request, @Res() res: Response) {
        return await this.occasionService.updatePostInfo(files, req, res);
    }

    @Delete('/:id')
    @HttpCode(200)
    @UseGuards(AuthGuard("jwt-device"))
    async deleteUserPost(@Req() req: Request, @Res() res: Response) {
        return await this.occasionService.deleteUserPost(req, res);
    }

    @Post('/like-dislike')
    @HttpCode(200)
    @UseGuards(AuthGuard("jwt-device"))
    async likeDislikePost(@Body(new ValidationPipe()) data: LikeUnlikePost, @Req() req: Request, @Res() res: Response) {
        return await this.occasionService.likeDislikePost(req, res);
    }

    @Post('/comment')
    @HttpCode(200)
    @UseGuards(AuthGuard("jwt-device"))
    async createUserComment(@Body(new ValidationPipe()) data: CommentOnPost, @Req() req: Request, @Res() res: Response) {
        return await this.occasionService.createUserComment(req, res);
    }
}
