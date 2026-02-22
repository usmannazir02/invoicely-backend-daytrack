import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

// Custom extractor that checks cookies first, then Authorization header
const cookieExtractor = (req: Request): string | null => {
  // First, try to extract from cookies
  if (req && req.cookies && req.cookies['access_token']) {
    return req.cookies['access_token'];
  }

  // If no token in cookies, try Authorization header (for API clients like Postman)
  const headerToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
  return headerToken;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
