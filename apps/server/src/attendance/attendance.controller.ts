import { Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Role } from 'src/iam/authorization/decorators/role.decorator';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { AttendanceService } from './attendance.service';

@Controller('attendance')
@Role('EMPLOYEE', 'HR')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @HttpCode(HttpStatus.OK)
  @Post('check-in')
  checkIn(@ActiveUser('sub') id: string) {
    return this.attendanceService.checkIn(id);
  }

  @HttpCode(HttpStatus.OK)
  @Post('check-out')
  checkOut(@ActiveUser('sub') id: string) {
    return this.attendanceService.checkOut(id);
  }

  @HttpCode(HttpStatus.OK)
  @Get('status')
  status(@ActiveUser('sub') id: string) {
    return this.attendanceService.status(id);
  }
}
