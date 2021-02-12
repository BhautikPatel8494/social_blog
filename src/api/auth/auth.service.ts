import { Injectable, OnModuleInit, Logger, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Response, Request } from 'express';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';

import { User } from '@shared/interface/model.interface';
import { CommonService } from '@shared/services/common.service'
import { response } from '@shared/services/sendResponse.service';
import { RESPONSE_STATUS_CODES } from '@shared/constants';

import { JwtPayload } from './interfaces/jwt-payload.interface';
const saltRounds = 10;

@Injectable()
export class AuthService {

  constructor(
    private readonly commonService: CommonService,

    @InjectModel('User') private readonly userModel: Model<User>,
  ) { }

  async validateUser(payload: JwtPayload) {
    const { _id, apiToken } = payload
    return await this.userModel.findOne({ _id, apiToken });
  }

  async signUpForUser(req: Request, res: Response) {
    const userInfo = req.body;
    const { email, password, name } = userInfo
    const userWithEmailAlreadyInDB = await this.userModel.findOne({ email: email }).lean().exec();
    if (userWithEmailAlreadyInDB) return response('user.auth.signUp.existWithEmail', RESPONSE_STATUS_CODES.badRequest, res)
    const encryptedPassword = await bcrypt.hash(password, saltRounds);
    let createUser = await this.userModel.create({email, password: encryptedPassword, name});
    const token = await this.commonService.generateToken(createUser);
    createUser.apiToken = token
    createUser.save()
    return response('user.auth.signUp.success', RESPONSE_STATUS_CODES.success, res, { token, user: createUser })
  }

  async loginForUser(req: Request, res: Response) {
    const { email, password } = req.body;
    const userWithEmailAlreadyInDB = await this.userModel.findOne({ email: email }).lean().exec();
    if (!userWithEmailAlreadyInDB) return response('common.userNotFound', RESPONSE_STATUS_CODES.notFound, res)
    let userExist = await this.userModel.findOne({ email });
    const comparePassword = await bcrypt.compare(password, userExist.password);
    if (!comparePassword) {
      return response('user.auth.logIn.invalidPassword', RESPONSE_STATUS_CODES.badRequest, res)
    }
    const token = await this.commonService.generateToken(userExist);
    userExist.apiToken = token;
    userExist.save()
    delete userExist.password;
    return response('user.auth.logIn.success', RESPONSE_STATUS_CODES.success, res, { token, user: userExist })
  }
}
