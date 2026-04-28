import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from 'src/generated/prisma/internal/prismaNamespace';
import { BcryptService } from 'src/iam/hashing/bcrypt.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private bcryptService: BcryptService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const { email, temporaryPassword, firstName, lastName, role } =
      createUserDto;
    try {
      const user = await this.prismaService.user.create({
        data: {
          email: email,
          password: await this.bcryptService.hash(temporaryPassword),
          firstName: firstName,
          lastName: lastName,
          role: role,
        },
        select: {
          id: true,
          email: true,
          role: true,
          mustChangePassword: true,
        },
      });

      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException();
        }
      }

      throw error;
    }
  }
}
