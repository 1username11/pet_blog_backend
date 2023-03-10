import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { forwardRef } from '@nestjs/common/utils';

@Module({
  //модуль -це клас який дозволяє сформувати структуру застосунку і являється відправною/вузловою точкою для побудови графу залежносте
  controllers: [UserController], //реєстрація контроллера який відповідає за обробку роутів пов'язаних з куриствачем
  providers: [UserService], //реєстрація сервісу який буде використовуватись в рамках цього модуля
  imports: [
    TypeOrmModule.forFeature([User]), //forFeature - показує  які ентіті будуть доступні в данному модулі
    forwardRef(() => AuthModule), //forwardRef - функція яка використовується для того щоб колові залежності працювали вірно, в іншому випадку нест не зможе створити екземпляри модулів
  ], //імпорт модулів які використовуватимуться в юзермодулі
  exports: [UserService],
})
export class UserModule {}
