import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto { // Data Transfer Object - об'єкт який визнає схему даних яі будуть відправлятись через запит
  @IsNotEmpty({
    message: 'Username is required',
  })
  username: string;

  @IsEmail({
    message: 'incorrect email',
  })
  email: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  password: string;
}
