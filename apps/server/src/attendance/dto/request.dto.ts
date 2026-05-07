import { IsNotEmpty, IsNumber } from 'class-validator';

export class RequestDto {
  @IsNumber()
  @IsNotEmpty()
  lat!: number;

  @IsNumber()
  @IsNotEmpty()
  lon!: number;
}
