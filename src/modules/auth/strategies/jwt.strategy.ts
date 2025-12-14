import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ROLE } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET_KEY!,
    });
  }

  validate(payload: { id: string; role: ROLE }) {
    console.log(payload);
    return payload;
  }
}
