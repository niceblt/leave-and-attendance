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
import { SignInDto } from './dto/sign-in.dto';
import { AuthType } from './enums/auth-type.enum';

@Controller('auth')
@Auth(AuthType.Bearer)
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @Auth(AuthType.None)
  async signIn(@Body() signInDto: SignInDto) {
    return this.authenticationService.signIn(signInDto);
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
}
