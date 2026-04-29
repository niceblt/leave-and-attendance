import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { REQUEST_USER_KEY } from '../iam.constants';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
export const ActiveUser = createParamDecorator(
  (key: keyof ActiveUserData, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest() as Request;
    const user = request[REQUEST_USER_KEY];
    if (user === undefined) {
      throw new Error('User is undefined');
    }
    return key === undefined ? user : user[key];
  },
);
