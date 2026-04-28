import {
  IsAlpha,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRole } from 'src/generated/prisma/enums';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(30)
  temporaryPassword!: string;

  @IsNotEmpty()
  @IsAlpha()
  @IsNotEmpty()
  @MaxLength(20)
  firstName!: string;

  @IsNotEmpty()
  @IsAlpha()
  @IsNotEmpty()
  @MaxLength(20)
  lastName!: string;

  @IsNotEmpty()
  @IsEnum(UserRole)
  role!: UserRole;
}
