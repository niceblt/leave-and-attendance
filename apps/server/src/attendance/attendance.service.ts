import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AttendanceStatus } from 'src/generated/prisma/client';
import { GeolocationService } from 'src/geolocation/geolocation.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { TimeService } from 'src/time/time.service';
import { RequestDto } from './dto/request.dto';

@Injectable()
export class AttendanceService {
  readonly ONE_HOUR_IN_MILISECOND = 3_600_000;
  readonly MINIMUM_WORK_HOURS = this.ONE_HOUR_IN_MILISECOND * 9;
  readonly HALF_MINIMUM_WORK_HOURS = this.MINIMUM_WORK_HOURS / 2;
  readonly ALLOWED_RADIUS = 100;

  // TODO: 1. Make the time things its own module
  // 2. Validate with geolocation
  // 3.
  constructor(
    private readonly prismaService: PrismaService,
    private readonly geolocationService: GeolocationService,
    private readonly timeService: TimeService,
  ) {}
  async checkIn(id: string, requestDto: RequestDto) {
    const { lat, lon } = requestDto;
    const now = new Date();
    if (now.getTime() < this.timeService.getMinimumCheckInTime()) {
      throw new UnauthorizedException('You are not allowed to check in early');
    }

    const officeLocation = await this.prismaService.officeLocation.findFirst();
    if (!officeLocation) {
      throw new BadRequestException('Office not found');
    }
    const { latitude: officeLat, longitude: officeLon } = officeLocation;
    const { isWithinRadius, distance } = this.geolocationService.isWithinRadius(
      lat,
      lon,
      officeLat,
      officeLon,
      this.ALLOWED_RADIUS,
    );

    if (!isWithinRadius) {
      throw new HttpException(
        {
          error: 'You are too far from the office.',
          distance,
          allowedRadius: this.ALLOWED_RADIUS,
          statusCode: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const hasCheckedIn = await this.hasCheckedIn(id);
    if (hasCheckedIn) {
      throw new HttpException(
        {
          error: 'You have already checked in today',
          distance,
          allowedRadius: this.ALLOWED_RADIUS,
          statusCode: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const currentTime = new Date();
    const attendance = await this.prismaService.attendance.create({
      data: {
        userId: id,
        date: currentTime,
        checkInTime: currentTime,
        checkInLat: lat,
        checkInLng: lon,
        checkInDistance: distance,
      },
      select: {
        id: true,
        checkInTime: true,
        checkInDistance: true,
        status: true,
      },
    });

    return { attendance, message: 'Check-in successful' };
  }

  async checkOut(id: string, requestDto: RequestDto) {
    const { lat, lon } = requestDto;
    const [hasCheckedIn, hasCheckedOut] = await Promise.all([
      this.hasCheckedIn(id),
      this.hasCheckedOut(id),
    ]);

    if (!hasCheckedIn) {
      throw new ConflictException('User needs to check in first');
    }

    if (hasCheckedOut) {
      throw new ConflictException('Already checked out');
    }

    const currentTime = new Date();

    const attendance = await this.prismaService.attendance.update({
      where: { id: hasCheckedIn.id },
      data: {
        checkOutTime: currentTime,
        checkOutLng: lon,
        checkOutDistance: 1,
        checkOutLat: lat,
        status: { push: this.evaluate(hasCheckedIn.checkInTime!, currentTime) },
      },
      select: { id: true, checkInTime: true, checkOutTime: true, status: true },
    });
    const totalHours = Math.floor(
      (attendance.checkOutTime!.getTime() - attendance.checkInTime!.getTime()) /
        this.ONE_HOUR_IN_MILISECOND,
    );

    return { attendance: { ...attendance, totalHours } };
  }

  async status(id: string) {
    return {
      minimumCheckInTime: this.timeService.getMinimumCheckInTime,
      hasCheckedIn: (await this.hasCheckedIn(id)) ? true : false,
      hasCheckedOut: (await this.hasCheckedOut(id)) ? true : false,
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

  private async hasCheckedOut(id: string) {
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const endOfToday = new Date(today.setDate(today.getDate() + 1));
    return await this.prismaService.attendance.findFirst({
      where: {
        userId: id,
        checkOutTime: { not: null },
        createdAt: { lte: endOfToday, gte: startOfToday },
      },
    });
  }

  private evaluate(checkInTime: Date, checkOutTime: Date) {
    {
      const workTime = checkOutTime!.getTime() - checkInTime!.getTime();

      if (workTime >= this.MINIMUM_WORK_HOURS) {
        return AttendanceStatus.PRESENT;
      } else if (workTime < this.HALF_MINIMUM_WORK_HOURS) {
        return AttendanceStatus.HALF_DAY;
      } else {
        return AttendanceStatus.LESS_THAN_HALF_DAY;
      }
    }
  }
}
