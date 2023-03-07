import { Controller, Get, ParseIntPipe, UseGuards, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {} //ін'єкція юзерсервісу

  @UseGuards(JwtAuthGuard) //використання гварду який дозволяє доступ до ендпоїнту тільки авторизованим користувачам (має бути валідний токен)
  @Get() // декоратор методу запиту
  findAll() {
    return this.userService.findAll(); //this - звернення до контроллера
  }
}
