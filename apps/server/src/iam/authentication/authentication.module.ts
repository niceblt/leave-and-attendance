import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisModule } from 'src/redis/redis.module';
import jwtConfig from '../config/jwt.config';
import { BcryptService } from '../hashing/bcrypt.service';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { RefreshTokenIdsStorage } from './refresh-token-ids.storage';

@Module({
  imports: [
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    RedisModule,
  ],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    PrismaService,
    BcryptService,
    JwtService,
    RefreshTokenIdsStorage,
  ],
})
export class AuthenticationModule {}
