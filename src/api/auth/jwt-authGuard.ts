import { PassportStrategy, AuthGuard } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JWTOptionalGuard extends AuthGuard('jwt-device') {

  handleRequest(err, user, info) {
    return user;
  }

}