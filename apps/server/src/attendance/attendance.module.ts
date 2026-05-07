import { Module } from '@nestjs/common';
import { GeolocationService } from 'src/geolocation/geolocation.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';

@Module({
  controllers: [AttendanceController],
  providers: [AttendanceService, PrismaService, GeolocationService],
})
export class AttendanceModule {}
