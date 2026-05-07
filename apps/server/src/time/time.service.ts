import { Injectable } from '@nestjs/common';

@Injectable()
export class TimeService {
  getMinimumCheckInTime() {
    const now = new Date();
    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      8,
      30,
      0,
      0,
    ).getTime();
  }

  getLateCheckInTime() {
    const now = new Date();
    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      9,
      15,
      0,
      0,
    ).getTime();
  }
}
