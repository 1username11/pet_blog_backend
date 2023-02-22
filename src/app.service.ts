import { Injectable } from '@nestjs/common';

@Injectable() //декоратор який позначає що сервіс може бути ін'єктовано в контроллер та зареєстровано в модулі
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
//сервіси - провайдери провайдери які відповідають за логіку методів, які в подальшому можуть використовуватись в контроллерах
