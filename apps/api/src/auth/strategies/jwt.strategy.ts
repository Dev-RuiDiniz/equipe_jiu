import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

const cookieExtractor = (request: { cookies?: Record<string, string> }) => {
  if (!request?.cookies) {
    return null;
  }

  return request.cookies.access_token ?? null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'change_me'),
    });
  }

  async validate(payload: { sub: string; email: string; papel: 'admin' | 'professor' }) {
    return {
      id: payload.sub,
      email: payload.email,
      papel: payload.papel,
    };
  }
}
