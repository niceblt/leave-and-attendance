import {
  Body,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { randomUUID } from 'crypto';
import { User } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import jwtConfig from '../config/jwt.config';
import { BcryptService } from '../hashing/bcrypt.service';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { RefreshTokensDto } from './dto/refresh-tokens.dto';
import { SignInDto } from './dto/sign-in.dto';
import {
  InvalidatedRefreshTokenError,
  RefreshTokenIdsStorage,
} from './refresh-token-ids.storage';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly bcryptService: BcryptService,
    private readonly prismaService: PrismaService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
    private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage,
  ) {}

  async signIn(@Body() signInDto: SignInDto) {
    const { email, password } = signInDto;
    console.log('hello world');
    const user = await this.prismaService.user.findFirst({
      where: { email: email },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        password: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException("User doesn't exist");
    }

    const isEqual = await this.bcryptService.compare(password, user.password);

    if (!isEqual) {
      throw new UnauthorizedException('Invalid password');
    }

    const [accessToken, refreshToken] = await this.generateTokens(user);
    const { password: _, ..._user } = user;
    return { accessToken, refreshToken, user: _user };
  }

  async me(id: string) {
    const user = await this.prismaService.user.findFirst({
      where: { id: id },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
      },
    });

    if (user === undefined) {
      throw new NotFoundException();
    }

    return { user };
  }
  private async signToken<T>(userId: string, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      } as ActiveUserData,
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }

  async generateTokens(user: Pick<User, 'id' | 'email' | 'role'>) {
    const refreshTokenId = randomUUID();

    const [accessToken, refreshToken] = await Promise.all([
      this.signToken(user.id, this.jwtConfiguration.accessTokenTtl, {
        email: user.email,
        role: user.role,
      }),
      this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl, {
        refreshTokenId,
      }),
    ]);

    await this.refreshTokenIdsStorage.insert(user.id, refreshTokenId);
    return [accessToken, refreshToken];
  }

  async refreshTokens(refreshTokenDto: RefreshTokensDto) {
    try {
      const { sub, refreshTokenId } = await this.jwtService.verifyAsync<
        Pick<ActiveUserData, 'sub'> & { refreshTokenId: string }
      >(refreshTokenDto.refreshToken, {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      });
      const user = await this.prismaService.user.findFirstOrThrow({
        where: { id: sub },
      });

      const isValid = await this.refreshTokenIdsStorage.validate(
        user.id,
        refreshTokenId,
      );

      if (isValid) {
        await this.refreshTokenIdsStorage.invalidate(user.id);
      } else {
        throw new InvalidatedRefreshTokenError();
      }
      const [accessToken, refreshToken] = await this.generateTokens(user);
      return { accessToken, refreshToken };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new InvalidatedRefreshTokenError();
        }
      }

      if (error instanceof InvalidatedRefreshTokenError) {
        throw new UnauthorizedException('Invalid refresh token.');
      }
    }
  }
}
