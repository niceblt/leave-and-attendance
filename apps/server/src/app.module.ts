import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IamModule } from './iam/iam.module';
import { PrismaService } from './prisma/prisma.service';
import { UsersModule } from './users/users.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), IamModule, UsersModule, RedisModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
