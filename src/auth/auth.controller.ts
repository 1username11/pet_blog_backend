import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {} //ін'єкція сервісу з логікою

  @Post('/login') //метод запиту
  login(@Body() userDto: CreateUserDto) {
    //@Body - декоратор який надає доступ до тіла запиту
    return this.authService.login(userDto); //this - звернення до контроллера
  }

  @Post('/registration')
  registration(@Body() userDto: CreateUserDto) {
    //@Body - декоратор який надає доступ до тіла запиту
    return this.authService.registration(userDto); //this - звернення до контроллера
  }

  @Post('/registrationWithQueryBuilder')
  registrationWithQueryBuilder(@Body() userDto: CreateUserDto) {
    //@Body - декоратор який надає доступ до тіла запиту
    return this.authService.registrationWithQueryBuilder(userDto); //this - звернення до контроллера
  }
}
