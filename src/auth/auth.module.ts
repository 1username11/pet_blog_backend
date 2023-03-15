import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JWTSECRET } from 'config';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController], //реєстрація контроллера
  providers: [AuthService], //реєстрація сервісу
  imports: [
    UserModule,
    JwtModule.register({
      //імпорт JWT модуля
      secret: JWTSECRET, //секретний ключ за допомогою якого генерується токен(будь-яка стрінга)
      signOptions: { expiresIn: '24h' }, //токен дійсний напротязі стількох годин
    }),
  ],
  exports: [AuthService, JwtModule], //експорт сервісів для використання в інших модулях
})
export class AuthModule {}
