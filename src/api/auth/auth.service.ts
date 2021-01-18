import { Injectable, OnModuleInit, Logger, HttpException,forwardRef, Inject } from '@nestjs/common';
import { Response, Request } from 'express';
import { ConfigService } from '../../config/services/config.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { v4 } from 'uuid';
import { User } from '../../shared/interface/model.interface';
import {CommonService} from '../../shared/services/common.service'


const saltRounds = 10;

@Injectable()
export class AuthService implements OnModuleInit {

  constructor(
    private readonly commonService :CommonService,
    private readonly configService: ConfigService,
    // @Inject(forwardRef(() => CommonService))
    // private commonService: CommonService,
   
    @InjectModel('User') private readonly userModel: Model<User>,
  ) { }
  serverToken = this.configService.get('SERVER_TOKEN');

  // This will check user is valid or not for authorization
  async validateUser(payload: { [key: string]: any }): Promise<any> {
    try {

      return await this.userModel.findOne({ email: payload.email, apiToken: payload.token });
    } catch (error) {
      throw error;
    }
  }

  // Admin Register
  async registerAdmin(req: Request, res: Response) {
    try {
      let userData = req.body;
      const emailExist = await this.userModel.findOne({ email: userData.email }).lean().exec();
      if (emailExist) {
        return res.status(200).json({ statusCode: 400, message: 'Email is already exist. Please try with login.', data: null });
      } else {
        // Encrypt password
        userData.password = await bcrypt.hash(userData.password, saltRounds);
        userData.verificationToken = v4();
        userData.userType = 'Admin';
        const createUser = await this.userModel.create(userData);
        if (createUser) {
          const userData = { ...createUser._doc };
          delete userData.password;
          return res.status(200).json({ statusCode: 200, message: 'Admin created successfully.', data: userData });
        } else {
          return res.status(400).json({ statusCode: 400, message: 'Failed to register admin. Please try again later', data: null });
        }
      }
      } catch (error) {
        // tslint:disable-next-line: no-console
        Logger.error('\n Admin Sign Up Err : ', error);
        return res.json({ statusCode: 500, message: 'Failed to sign up for admin.', data: null });
      }
      // try {
      //   // tslint:disable-next-line: prefer-const
      //   let userData = req.body;
      //   const emailExist = await this.userModel.findOne({ email: userData.email }).lean().exec();
      //   if (emailExist) {
      //     return res.status(200).json({ statusCode: 400, message: 'Email is already exist. Please try with login.', data: null });
      //   } else {
      //     // Encrypt password
      //     userData.password = await bcrypt.hash(userData.password, saltRounds);
      //     userData.verificationToken = v4();
      //     userData.userType = 'Admin';
      //     const createUser = await this.userModel.create(userData);
      //     if (createUser) {
      //       const userData = { ...createUser._doc };
      //       delete userData.password;
      //       delete userData.verificationToken;
      //       delete userData.resetPasswordCode;
      //       return res.status(200).json({ statusCode: 200, message: 'Admin created successfully.', data: userData });
      //     } else {
      //       return res.status(400).json({ statusCode: 400, message: 'Failed to register admin. Please try again later', data: null });
      //     }
      //   }
      // } catch (error) {
      //   // tslint:disable-next-line: no-console
      //   Logger.error('\n Admin Sign Up Err : ', error);
      //   return res.json({ statusCode: 500, message: 'Failed to sign up for admin.', data: null });
      // }
    }

  // Admin Login
  async loginForAdmin(req: Request, res: Response) {
      try {
        // tslint:disable-next-line: prefer-const
        let { email, password } = req.body;
        const query = {
          $and: [
            {
              $or: [
                { username: email },
                { email }
              ]
            },
            { userType: { $ne: 'User' } }
          ]
        }
        let userExist = await this.userModel.findOne(query).lean().exec();
        if (!userExist) {
          return res.status(200).json({ statusCode: 404, message: 'User not found. ', data: null });
        }
        const comparePassword = await bcrypt.compare(password, userExist.password);
        if (!comparePassword) {
          return res.status(200).json({ statusCode: 400, message: 'You have entered wrong password. Reset password if you have forgotten. ', data: null });
        }

        // Generate token
        const token =  await this.commonService.generateToken(userExist);
        const user = await this.userModel.findByIdAndUpdate(userExist._id, { apiToken: token }).lean().exec();
        const userData = { ...user };
        delete userData.password;
        delete userData.verificationToken;
        delete userData.resetPasswordCode;
        return res.status(200).json({ statusCode: 200, message: 'Login Successfully. ', data: { token, user: userData } });
      } catch (error) {
        // tslint:disable-next-line: no-console
        Logger.error('\n Admin Login Err : ', error);
        return res.status(400).json({ statusCode: 500, message: 'Failed to login for admin.', data: null });
      }
    }

    // User Register
    async signUpForUser(req: Request, res: Response) {
      // try {
      //   // tslint:disable-next-line: prefer-const
      //   let userData = req.body;
      //   const userExist = await this.userModel.findOne({ email: userData.email, phoneNumber: userData.phoneNumber }).lean().exec();
      //   if (userExist) {
      //     return res.status(200).json({ statusCode: 400, message: 'User already exist with email or phoneNumber.', data: null });
      //   } else {
      //     // const sendOTP = await this.twilioService.sendOTPToUser(userData.phoneNumber, userData.callingCode);
      //     const sendOTP = true
      //     if (sendOTP) {
      //       // Encrypt password
      //       userData.password = await bcrypt.hash(userData.password, saltRounds);
      //       userData.verificationToken = v4();
      //       userData.userType = 'User';

      //       //calculate giftcard point
      //       const giftcardUsers: any = await this.userGiftCardModel.find({ recipientMail: userData.email, isRedeemed: false }).lean().exec();
      //       if (giftcardUsers && giftcardUsers.length) {
      //         let totalGiftCardAmount = 0;
      //         for await (let mGiftCard of giftcardUsers) {
      //           totalGiftCardAmount = totalGiftCardAmount + mGiftCard.amount;
      //         }
      //         userData.totalGifCardAmount = totalGiftCardAmount;
      //       }

      //       let createUser = await this.userModel.create(userData);
      //       if (createUser) {
      //         userData.id = createUser._id
      //         const createSquareUser = await this.squareService.createSqureUser(userData)
      //         if (createSquareUser) {
      //           createUser.customerId = createSquareUser.id
      //           createUser.save()
      //         }
      //         const userResponse = { ...createUser._doc };
      //         delete userResponse.password;
      //         delete userResponse.verificationToken;
      //         delete userResponse.resetPasswordCode;
      //         return res.status(200).json({ statusCode: 200, message: 'User created successfully. Please enter OTP', data: userResponse });
      //       } else {
      //         return res.status(200).json({ statusCode: 400, message: 'Failed to create user. Please try again later', data: null });
      //       }
      //     } else {
      //       return res.json({ status: 500, message: 'Failed to signUp user. Please try again.', data: null });
      //     }
      //   }
      // } catch (error) {
      //   // tslint:disable-next-line: no-console
      //   Logger.error('\n Admin Sign Up Err : ', error);
      //   return res.json({ statusCode: 500, message: 'Failed to sign up for user.', data: null });
      // }
    }

    async loginForUser(req: Request, res: Response) {
      // try {
      //   // tslint:disable-next-line: prefer-const
      //   let { email, password, deviceToken, deviceType } = req.body;

      //   let userExist = await this.userModel.findOne({ email, userType: 'User' }).select('-verificationToken -resetPasswordCode');
      //   if (!userExist) {
      //     return res.status(200).json({ statusCode: 404, message: 'User not found. ', data: null });
      //   }
      //   const comparePassword = await bcrypt.compare(password, userExist.password);
      //   if (!comparePassword) {
      //     return res.status(200).json({ statusCode: 400, message: 'You have entered wrong password. Reset password if you have forgotten. ', data: null });
      //   }
      //   if (deviceToken && deviceType) {
      //     userExist.deviceToken = deviceToken
      //     userExist.deviceType = deviceType
      //     userExist.save()
      //   }

      //   // Generate token
      //   const token = this.commonService.generateToken(userExist);
      //   const user = await this.userModel.findByIdAndUpdate(userExist._id, { apiToken: token }).lean().exec();
      //   const address = await this.userAddressModel.findOne({ userId: userExist._id, default: true });
      //   const defaultCard = await this.userCardModel.findOne({ userId: userExist._id, isDefault: true }).lean().exec();
      //   const userData = { ...user, address, defaultCard };
      //   delete userData.password;

      //   return res.status(200).json({ statusCode: 200, message: 'Login Successfully. ', data: { token, user: userData } });
      // } catch (error) {
      //   // tslint:disable-next-line: no-console
      //   Logger.error('\n Admin Login Err : ', error);
      //   return res.status(400).json({ statusCode: 500, message: 'Failed to login for user.', data: null });
      // }
    }


    async forgotPassword(req: any, res: Response): Promise < any > {
      try {
        const { email } = req.body;

        //Check user exist or not
        const userExist = await this.userModel.findOne({ email }).lean().exec();
        if(!userExist) {
          return res.json({ statusCode: 400, message: "Email does not exist" });
        }
      // const code = Math.floor(100000 + Math.random() * 900000);
      const code = 123456
      await this.userModel.findOneAndUpdate({ email }, { resetPasswordCode: code });
        return res.json({ statusCode: 200, message: "Please check your email for forgot password code.", data: { code } });
      } catch(error) {
        throw error;
      }
    }

    async resetPassword(req: any, res: Response): Promise < any > {
      try {
        const { email, password, code } = req.body;

        //Check user exist or not
        let userExist: any = await this.userModel.findOne({ email })
      if(!userExist) {
          return res.json({ statusCode: 400, message: "Email does not exist" });
        }
      if(userExist.resetPasswordCode !== code) {
      return res.json({ statusCode: 400, message: "Invalid OTP. Please enter valid OTP." });
    }
    userExist.password = await bcrypt.hash(password, saltRounds);
    userExist.resetPasswordCode = null;
    userExist.save()
    return res.json({ statusCode: 200, message: "Password updated sucsessfully." });
  } catch(error) {
    throw error;
  }
}



async changePassword(req: any, res: Response): Promise < any > {
  try {

    const { oldPassword, newPassword } = req.body;
    let findUser: any = await this.userModel.findById(req.user._id);
    if(findUser) {
      const comparePassword = await bcrypt.compare(oldPassword, findUser.password);
      if (!comparePassword) {
        return res.json({ statusCode: 400, message: "Old Password is incorrect.", data: null });
      } else {
        findUser.password = await bcrypt.hash(newPassword, saltRounds);
        findUser.save()
        return res.json({ statusCode: 200, message: "Password updated successfully", data: null });
      }
    }
      return res.json({ statusCode: 400, message: "User not found.", data: null });
  } catch(error) {
    throw error;
  }
}

//Add default admin
async onModuleInit() {
  try {
    const adminExists: any = await this.userModel.find({ userType: 'Admin' }).lean().exec()
    if (adminExists.length === 0) {
      let adminObj = {
        userType: 'Admin',
        username: "Coffee Roaster Admin",
        email: "admin.coffee-roaster@gmail.com",
        password: "12345678"
      };

      let { userType, username, email, password } = adminObj;
      password = await bcrypt.hash(password, saltRounds);
      await this.userModel.create({ userType, username, email, password });
      console.log('======= Default admin created =======')
    }
  } catch (error) {
    throw new HttpException(
      "Error while adding default  admin",
      error.message
    );
  }
}

}
