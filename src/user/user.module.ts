import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';


@Module({
  //модуль -це клас який дозволяє сформувати структуру застосунку і являється відправною/вузловою точкою для побудови графу залежносте
  providers: [UserService], //реєстрація сервісу який буде використовуватись в рамках цього модуля
  imports: [
    TypeOrmModule.forFeature([User]), //forFeature - показує  які ентіті будуть доступні в данному модулі
  ], //імпорт модулів які використовуватимуться в юзермодулі
  exports: [UserService],
})
export class UserModule {}
