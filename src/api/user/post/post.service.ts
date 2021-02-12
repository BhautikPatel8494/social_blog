import { Injectable } from '@nestjs/common';
import { Response, Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UserPost, LikeDislikeModel, CommentModel } from '@shared/interface/model.interface';
import { response } from '@root/shared/services/sendResponse.service';
import { RESPONSE_STATUS_CODES } from '@root/shared/constants';
import { CommonService } from '@root/shared/services/common.service';

@Injectable()
export class UserPostService {

    constructor(
        @InjectModel('UserPost') private readonly postModel: Model<UserPost>,
        @InjectModel('LikeDislike') private readonly likeDislikeModel: Model<LikeDislikeModel>,
        @InjectModel('Comment') private readonly commentModel: Model<CommentModel>,
        private readonly commonService: CommonService,
    ) { }

    async getAllPost(req: any, res: Response) {
        const getListOfPost = await this.postModel.find({}).select('userId _id description postImage').lean().exec();
        return response('features.post.list.success', RESPONSE_STATUS_CODES.success, res, getListOfPost)
    }

    async getSinglePost(req: any, res: Response) {
        const { postId } = req.body;
        let getSinglePost = await this.postModel.findById(postId).select('userId _id description postImage').lean().exec();
        if (!getSinglePost) {
        return response('features.post.notExist', RESPONSE_STATUS_CODES.notFound, res)
        }
        return response('features.post.list.success', RESPONSE_STATUS_CODES.success, res, getSinglePost)
    }

    async createUserPost(file: any, req: any, res: Response) {
        const insertData = req.body;
        if (file && file.postImage && file.postImage.length) {
            const uploadImage = await this.commonService.manageUploadImage(file, 'postImage', res)
            insertData.postImage = uploadImage;
        }
        const createPostRecord = await this.postModel.create({...insertData, userId: req.user._id});
        return response('features.post.success', RESPONSE_STATUS_CODES.success, res, createPostRecord)
    }

    async updatePostInfo(file: any, req: any, res: Response) {
        const { id } = req.params
        const updateData = req.body;
        if (file && file.postImage && file.postImage.length) {
            const uploadImage = await this.commonService.manageUploadImage(file, 'postImage', res)
            updateData.postImage = uploadImage;
        }
        const updatedInformationForPost = await this.postModel.findByIdAndUpdate(id, updateData, { new: true })
        return response('features.post.updated', RESPONSE_STATUS_CODES.success, res, updatedInformationForPost)
    }

    async deleteUserPost(req: any, res: Response) {
        const { id } = req.params
        let postInfoInDb = await this.postModel.findByIdAndDelete(id);
        if (!postInfoInDb) {
            return response('features.post.notExist', RESPONSE_STATUS_CODES.notFound, res)
        }
        return response('features.post.deleted', RESPONSE_STATUS_CODES.success, res)
    }

    async likeDislikePost(req: any, res: Response) {
        const { status, postId } = req.body
        if (status == 1) {
            await this.likeDislikeModel.updateOne({postId, userId: req.user._id}, {}, { strict: false, upsert: true });
        } else {
            await this.likeDislikeModel.findOneAndDelete({postId, userId: req.user._id});
        }
        return response('features.post.common.success', RESPONSE_STATUS_CODES.success, res)
    }

    async createUserComment(req: any, res: Response) {
        const { postId } = req.body;
        const getSinglePost = await this.postModel.findById(postId).lean().exec();
        if (!getSinglePost) {
        return response('features.post.notExist', RESPONSE_STATUS_CODES.notFound, res)
        }
        const createComment = await this.commentModel.create({...req.body, userId: req.user._id})
        return response('features.post.common.success', RESPONSE_STATUS_CODES.success, res, createComment)
    }
}
