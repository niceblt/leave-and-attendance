import {
  Body,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import jwtConfig from '../config/jwt.config';
import { BcryptService } from '../hashing/bcrypt.service';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly bcryptService: BcryptService,
    private readonly prismaService: PrismaService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(@Body() signInDto: SignInDto) {
    const { email, password } = signInDto;
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

    if (user === null) {
      throw new UnauthorizedException("User doesn't exist");
    }

    const isEqual = await this.bcryptService.compare(password, user.password);

    if (!isEqual) {
      throw new UnauthorizedException('Invalid password');
    }

    const accessToken = await this.signToken<Partial<ActiveUserData>>(
      user.id,
      this.jwtConfiguration.accessTokenTtl,
      { email: user.email, role: user.role },
    );
    const { password: _, ..._user } = user;
    return { accessToken, refreshToken: null, user: _user };
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
}
