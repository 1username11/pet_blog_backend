import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller() //декоратор який позначає клас який відповідає за обробку запитів і повернення відповідей на клієнт
export class AppController {
  //клас експортується для того щоб можна було зареєструвати його в модулі
  constructor(private readonly appService: AppService) {} //ін'єкція AppService в контроллер

  @Get() //декоратор який позначає гет-запит
  getHello(): string {
    return this.appService.getHello(); //this - це звернення до екзмепляру классу AppController, далі викликається ін'єктований в цей класс сервіс і в сервісі викликається метод gethello
  }
}
