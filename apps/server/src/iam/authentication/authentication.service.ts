import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BcryptService } from '../hashing/bcrypt.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly bcryptService: BcryptService,
    private readonly prismaService: PrismaService,
  ) {}
}
