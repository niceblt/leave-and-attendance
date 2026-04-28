import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthenticationModule } from './authentication/authentication.module';
import jwtConfig from './config/jwt.config';

@Module({
  imports: [
    AuthenticationModule,
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  providers: [PrismaService],
})
export class IamModule {}
