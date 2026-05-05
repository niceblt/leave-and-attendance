import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AttendanceService {
  readonly MINIMUM_CHECK_IN_TIME = new Date().setHours(8, 30, 0, 0);
  // TODO: 1. Make the time things its own module
  // 2. Validate with geolocation
  // 3.
  constructor(private readonly prismaService: PrismaService) {}
  async checkIn(id: string) {
    const today = new Date();

    if (today.getTime() < this.MINIMUM_CHECK_IN_TIME) {
      throw new UnauthorizedException('You are not allowed to check in early');
    }

    const isExisting = await this.hasCheckedIn(id);

    if (isExisting) {
      throw new ConflictException('This user already checked in today.');
    }

    const currentTime = new Date();
    return await this.prismaService.attendance.create({
      data: {
        userId: id,
        date: currentTime,
        checkInTime: currentTime,
        checkInLat: 1,
        checkInLng: 1,
        checkInDistance: 1,
      },
    });
  }

  async checkOut(id: string) {
    const isExisting = await this.hasCheckedIn(id);

    if (!isExisting) {
      throw new ConflictException('User needs to check in first');
    }

    const currentTime = new Date();

    return await this.prismaService.attendance.update({
      where: { id: isExisting.id },
      data: {
        checkOutTime: currentTime,
        checkOutLng: 1,
        checkOutDistance: 1,
        checkOutLat: 1,
      },
    });
  }

  async status(id: string) {
    return {
      minimumCheckInTime: this.MINIMUM_CHECK_IN_TIME,
      hasCheckedIn: (await this.hasCheckedIn(id)) ? true : false,
    };
  }

  private async hasCheckedIn(id: string) {
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const endOfToday = new Date(today.setDate(today.getDate() + 1));
    return await this.prismaService.attendance.findFirst({
      where: {
        userId: id,
        checkInTime: { not: null },
        createdAt: { lte: endOfToday, gte: startOfToday },
      },
    });
  }
}
