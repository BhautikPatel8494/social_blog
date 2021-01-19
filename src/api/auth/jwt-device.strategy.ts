import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { ConfigService } from '@config/services/config.service';

import { JwtPayload } from './interfaces/jwt-payload.interface';
import { AuthService } from './auth.service';
@Injectable()
export class JwtDeviceStrategy extends PassportStrategy(Strategy, 'jwt-device') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: JwtPayload) {
    // tslint:disable-next-line: no-string-literal
    const token = request.headers['authorization'];
    payload.token = token.slice(7, token.length).trimLeft();

    const user = await this.authService.validateUser(payload);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
