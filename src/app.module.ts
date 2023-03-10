import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { DatabaseModule } from './database/database.module';
import * as path from 'path';

@Module({
  //модуль -це клас який дозволяє сформувати структуру застосунку і являється відправною/вузловою точкою для побудови графу залежностей
  imports: [
    UserModule,
    PostModule,
    DatabaseModule, // створює модуль який відповідає за підключення до БД з використанням dataSourceOptions
    AuthModule,
    FilesModule,
    ServeStaticModule.forRoot({
      rootPath: path.resolve('./src/static'),
    }),
    DatabaseModule,
  ], // імпорт "другорядних модулів" в головний модуль
  controllers: [AppController], //реєстрація контроллерів які використовуються в модулі
  providers: [AppService], //реєстрація провайдерів які використовуються в рамках цього модуля (в контроллерах)
})
export class AppModule {} //екпорт модуля який в подальшому імпортується в мейн файл
//Граф залежностей - це граф в якому відображено структуру залежностей в застосунку
