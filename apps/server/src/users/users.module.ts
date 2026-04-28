import { Module } from '@nestjs/common';
import { BcryptService } from 'src/iam/hashing/bcrypt.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, BcryptService],
})
export class UsersModule {}
