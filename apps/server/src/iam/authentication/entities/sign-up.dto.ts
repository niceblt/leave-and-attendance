import { IsAlphanumeric, IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class SignUpDto {
    @IsNotEmpty()
    @IsAlphanumeric()
    @MinLength(5)
    @MaxLength(13)
    username!: string

    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(30)
    password!: string
}
