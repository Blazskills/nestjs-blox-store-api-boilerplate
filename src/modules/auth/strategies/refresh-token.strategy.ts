// Refresh Token Strategy

import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';
// request
import { Request } from 'express';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private configService: ConfigService,
    private prismaService: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }
  //Validate refresh token from the user

  async validate(req: Request, payload: { sub: string; email: string }) {
    console.log('Test refresh token strategy');

    console.log('payload', { sub: payload.sub, email: payload.email });

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Refresh token not provided');
      throw new UnauthorizedException('Refresh token not provided');
    }
    const refreshToken = authHeader.replace('Bearer ', '').trim();
    console.log('Refresh token', refreshToken);
    if (!refreshToken) {
      console.log('No refresh token provided after extraction');
      throw new UnauthorizedException(
        'No refresh token provided after extraction',
      );
    }

    const user = await this.prismaService.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        password: false,
        refreshToken: true,
      },
    });
    if (!user || !user.refreshToken) {
      console.log('Invalid refresh token');
      throw new UnauthorizedException('Invalid refresh token');
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!refreshTokenMatches) {
      console.log('Invalid refresh token. Refresh token does not match');
      throw new UnauthorizedException('Invalid refresh token');
    }
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };
  }
}
