import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IamModule } from './iam/iam.module';
import { HashingService } from './hashing/hashing.service';

@Module({
  imports: [IamModule],
  controllers: [AppController],
  providers: [AppService, HashingService],
})
export class AppModule {}
