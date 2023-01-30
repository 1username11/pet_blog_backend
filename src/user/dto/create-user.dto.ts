import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({
    message: 'Username is required',
  })
  username: string;

  @IsString({
    message: 'Email must be a string',
  })
  @IsEmail({
    message: 'incorrect email',
  })
  email: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  password: string;
}
