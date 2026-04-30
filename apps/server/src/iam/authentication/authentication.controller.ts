import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { ActiveUser } from '../decorators/active-user.decorator';
import { AuthenticationService } from './authentication.service';
import { Auth } from './decorators/auth.decorator';
import { RefreshTokensDto } from './dto/refresh-tokens.dto';
import { SignInDto } from './dto/sign-in.dto';
import { AuthType } from './enums/auth-type.enum';

@Controller('auth')
@Auth(AuthType.Bearer)
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  // @Throttle({ default: { ttl: 600000, limit: 5 } })
  @Auth(AuthType.None)
  async signIn(@Body() signInDto: SignInDto, @Res() response: Response) {
    console.log(signInDto);

    const result = await this.authenticationService.signIn(signInDto);
    response.cookie('access_token', result.accessToken);
    response.cookie('refresh_token', result.refreshToken);
    return response.json(result);
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async signOut(@Res() response: Response) {
    response.clearCookie('jwt');
    return { message: 'Logged out suscessfully' };
  }

  @HttpCode(HttpStatus.OK)
  @Get('me')
  async me(@ActiveUser('sub') id: string) {
    return this.authenticationService.me(id);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  @Auth(AuthType.None)
  async refreshToken(@Body() RefreshTokensDto: RefreshTokensDto) {
    return this.authenticationService.refreshTokens(RefreshTokensDto);
  }
}
