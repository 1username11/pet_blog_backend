import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import {
  HttpException,
  UnauthorizedException,
} from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt/dist';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  private async validateUser(createUserDto: CreateUserDto) {
    try {
      // Отримуємо юзера з бази даних за електронною поштою
      const user = await this.userService.getUserByEmail(createUserDto.email);
  
      // Порівнюємо пароль, який отримали з даними з бази даних
      const passwordEqual = await bcrypt.compare(
        createUserDto.password,
        user.password,
      );
  
      // Якщо пароль збігається і юзер існує, повертаємо об'єкт юзера
      if (passwordEqual && user) {
        return user;
      } else {
        // Якщо пароль не збігається, кидаємо виключення з помилкою
        throw new UnauthorizedException({
          message: 'Email або пароль введено неправильно',
        });
      }
    } catch (err) {
      // Якщо виникає помилка, кидаємо виключення з помилкою
      throw new HttpException('Помилка валідації юзера', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  

  async login(createUserDto: CreateUserDto) {
    try {
      const user = await this.validateUser(createUserDto); // Валідація користувача
      const token = await this.generateToken(user); // Генерація токену
      return token; // Повернення токену
    } catch (error) {
      throw new UnauthorizedException('email or password is incorrect'); // Обробка помилок
    }
  }
  

  async registration(createUserDto: CreateUserDto) {
    try {
      const candidate = await this.userService.getUserByEmail(createUserDto.email);
      if (candidate) { // перевірка, чи існує користувач з вказаною електронною адресою
        throw new HttpException('Користувач з такою електронною адресою вже існує', HttpStatus.BAD_REQUEST);
      }
  
      // хешування паролю
      const hashPassword = await bcrypt.hash(createUserDto.password, 10);
  
      // створення користувача
      const user = await this.userService.createUser({
        ...createUserDto,
        password: hashPassword,
      });
  
      // генерація токену
      const token = await this.generateToken(user);
  
      // повернення результату
      return token;
    } catch (error) {
      console.log(error)
      throw new HttpException('Не вдалося зареєструвати користувача', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  

  async generateToken(user: User) {
    try {
      const payload = { // дані, з яких буде створено токен
        id: user.id,
      };
      const token = this.jwtService.sign(payload); // генерація токену з payload
      return { token: token }; // повернення об'єкту з токеном
    } catch (error) { // обробка виключень
      throw new HttpException('Error generating token', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
}
