import { Injectable, OnModuleInit, Logger, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Response, Request } from 'express';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { v4 } from 'uuid';

import { ConfigService } from '@config/services/config.service';
import { User } from '@shared/interface/model.interface';
import { CommonService } from '@shared/services/common.service'
import { sendMail } from '@shared/services/nodeMailer.service';
import { UserTypes } from '@models/user.model';
import { response } from '@shared/services/sendResponse.service';
import { RESPONSE_STATUS_CODES } from '@shared/constants';

import { JwtPayload } from './interfaces/jwt-payload.interface';
const saltRounds = 10;

@Injectable()
export class AuthService implements OnModuleInit {

  constructor(
    private readonly commonService: CommonService,
    private readonly configService: ConfigService,

    @InjectModel('User') private readonly userModel: Model<User>,
  ) { }
  serverToken = this.configService.get('SERVER_TOKEN');

  async validateUser(payload: JwtPayload) {
    const { _id, apiToken } = payload
    return await this.userModel.findOne({ _id, apiToken });
  }

  async registerAdmin(req: Request, res: Response) {
    let userData = req.body;
    const emailExist = await this.userModel.findOne({ email: userData.email }).lean().exec();
    if (emailExist) {
      return response('user.auth.signUp.existWithEmail', RESPONSE_STATUS_CODES.badRequest, res)
    } else {
      userData.password = await bcrypt.hash(userData.password, saltRounds);
      userData.verificationToken = v4();
      userData.userType = UserTypes.admin;
      const createUser = await this.userModel.create(userData);
      if (createUser) {
        const userData = { ...createUser._doc };
        delete userData.password;
        return response('admin.auth.signUp.success', RESPONSE_STATUS_CODES.success, res)
      } else {
        return response('admin.auth.signUp.failed', RESPONSE_STATUS_CODES.badRequest, res)
      }
    }
  }

  async loginForAdmin(req: Request, res: Response) {
    let { email, password } = req.body;
    let userExist = await this.userModel.findOne({ email, userType: UserTypes.admin }).lean().exec();
    if (!userExist) {
      return response('common.userNotFound', RESPONSE_STATUS_CODES.notFound, res)
    }
    const comparePassword = await bcrypt.compare(password, userExist.password);
    if (!comparePassword) {
      return response('user.auth.logIn.invalidPassword', RESPONSE_STATUS_CODES.badRequest, res)
    }

    const token = await this.commonService.generateToken(userExist);
    const user = await this.userModel.findByIdAndUpdate(userExist._id, { apiToken: token }).lean().exec();
    const userData = { ...user };
    delete userData.password;
    delete userData.resetPasswordCode;
    return response('user.auth.logIn.success', RESPONSE_STATUS_CODES.success, res, { token, user: userData })
  }

  async signUpForUser(req: Request, res: Response) {
    const userInfo = req.body;
    const { email, password, name, socialMediaType, socialMediaId } = userInfo
    if (email) {
      const userWithEmailAlreadyInDB = await this.userModel.findOne({ email: email }).lean().exec();
      if (userWithEmailAlreadyInDB) return response('user.auth.signUp.existWithEmail', RESPONSE_STATUS_CODES.badRequest, res)
    }

    let isNeedToRegisterWithObj = null;
    if (email && password && name) {
      const encryptedPassword = await bcrypt.hash(password, saltRounds);
      isNeedToRegisterWithObj = { email, password: encryptedPassword }
    }

    else if (socialMediaType && socialMediaId) {
      const userExistWithSameCredantial = await this.userModel.findOne({ socialMediaType, socialMediaId }).lean().exec();
      if (userExistWithSameCredantial) return response('user.auth.signUp.existWithSameCredential', RESPONSE_STATUS_CODES.badRequest, res)
      isNeedToRegisterWithObj = { email, socialMediaType, socialMediaId }
    }

    if (isNeedToRegisterWithObj) {
      isNeedToRegisterWithObj.userType = UserTypes.user;
      let createUser = await this.userModel.create(isNeedToRegisterWithObj);
      const token = await this.commonService.generateToken(createUser);
      createUser.apiToken = token
      createUser.save()
      return response('user.auth.signUp.success', RESPONSE_STATUS_CODES.success, res, { token, user: createUser })
    } else {
      return response('common.invalidData', RESPONSE_STATUS_CODES.badRequest, res)
    }
  }

  async loginForUser(req: Request, res: Response) {
    const { email, password, socialMediaType, socialMediaId } = req.body;
    if (email) {
      const userWithEmailAlreadyInDB = await this.userModel.findOne({ email: email, userType: UserTypes.user }).lean().exec();
      if (!userWithEmailAlreadyInDB) return response('common.userNotFound', RESPONSE_STATUS_CODES.notFound, res)
    }

    let isValidUserObj = null
    if (email && password) {
      let userExist = await this.userModel.findOne({ email, userType: UserTypes.user });
      const comparePassword = await bcrypt.compare(password, userExist.password);
      if (!comparePassword) {
        return response('user.auth.logIn.invalidPassword', RESPONSE_STATUS_CODES.badRequest, res)
      }
      isValidUserObj = userExist
    } else if (socialMediaType && socialMediaId) {
      const userExistWithSameCredantial = await this.userModel.findOne({ socialMediaType, socialMediaId });
      if (userExistWithSameCredantial) isValidUserObj = userExistWithSameCredantial
    }

    if (isValidUserObj) {
      const token = await this.commonService.generateToken(isValidUserObj);
      isValidUserObj.apiToken = token;
      isValidUserObj.save()
      delete isValidUserObj.password;
      return response('user.auth.logIn.success', RESPONSE_STATUS_CODES.success, res, { token, user: isValidUserObj })
    } else {
      return response('common.userNotFound', RESPONSE_STATUS_CODES.notFound, res)
    }
  }

  async forgotPassword(req: Request, res: Response) {
    const { email } = req.body;
    const userExist = await this.userModel.findOne({ email }).lean().exec();
    if (!userExist) {
      return response('common.emailNotExiste', RESPONSE_STATUS_CODES.notFound, res)
    }
    const code = Math.floor(100000 + Math.random() * 900000);
    // const code = 123456
    sendMail('public/forgotPassword.ejs', email, { code: code })
    await this.userModel.findOneAndUpdate({ email }, { resetPasswordCode: code });
    return response('user.auth.resetPassword.code', RESPONSE_STATUS_CODES.success, res, { code })
  }

  async resetPassword(req: Request, res: Response) {
    const { email, newPassword, code } = req.body;
    let userExist = await this.userModel.findOne({ email })
    if (!userExist) {
      return response('common.emailNotExist', RESPONSE_STATUS_CODES.notFound, res)
    }
    if (userExist.resetPasswordCode !== code) {
      return response('user.auth.changePassword.invalidCode', RESPONSE_STATUS_CODES.badRequest, res)
    }
    userExist.password = await bcrypt.hash(newPassword, saltRounds);
    userExist.resetPasswordCode = null;
    userExist.save()
    return response('user.auth.changePassword.passwordSuccess', RESPONSE_STATUS_CODES.success, res)
  }

  async changePassword(req: any, res: Response) {
    const { oldPassword, newPassword } = req.body;
    let findUserIsExist = await this.userModel.findById(req.user._id);
    if (findUserIsExist) {
      const comparePassword = await bcrypt.compare(oldPassword, findUserIsExist.password);
      if (!comparePassword) {
        return response('user.auth.changePassword.oldPasswordIncorrect', RESPONSE_STATUS_CODES.badRequest, res)
      } else {
        findUserIsExist.password = await bcrypt.hash(newPassword, saltRounds);
        findUserIsExist.save()
        return response('user.auth.changePassword.passwordSuccess', RESPONSE_STATUS_CODES.success, res)
      }
    }
    return response('common.userNotFound', RESPONSE_STATUS_CODES.notFound, res)
  }

  async addDeviceTokenInList(req: any, res: Response) {
    const { deviceToken, deviceType } = req.body;
    if (req.user.deviceTokenList) {
      const isTokenAlreadyEixts = req.user.deviceTokenList.find(dData => dData.deviceType === deviceType && dData.deviceToken === deviceToken)
      if (isTokenAlreadyEixts) {
        return response('user.auth.deviceToken.exist', RESPONSE_STATUS_CODES.success, res)
      }
    }
    let updateDeviceTokenList = req.user.deviceTokenList ? req.user.deviceTokenList : []
    updateDeviceTokenList.push({ deviceType, deviceToken })
    await this.userModel.findByIdAndUpdate(req.user._id, { deviceTokenList: updateDeviceTokenList })
    return response('user.auth.deviceToken.success', RESPONSE_STATUS_CODES.success, res)
  }

  //Add default admin
  async onModuleInit() {
    const adminExists = await this.userModel.find({ userType: UserTypes.admin }).lean().exec()
    if (!adminExists.length) {
      let adminObj = {
        userType: UserTypes.admin,
        name: 'Default Admin Created By Server',
        username: "Reminder App Admin",
        email: "admin.reminder-app@gmail.com",
        password: "12345678"
      };
      adminObj.password = await bcrypt.hash(adminObj.password, saltRounds);
      await this.userModel.create(adminObj);
      console.log('======= Default admin created =======')
    }
  }
}
