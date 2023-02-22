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

  private async validateUser(createUserDto: CreateUserDto) { //валідація юзера (перевірка пароля)
    const user = await this.userService.getUserByEmail(createUserDto.email);
    const passwordEqual = await bcrypt.compare( //порівняння двох хешів на співпадіння
      createUserDto.password,
      user.password,
    );
    if (passwordEqual && user) {
      return user; 
    } else {
      throw new UnauthorizedException({
        message: 'email or password is incorrect',
      });
    }
  }

  async login(createUserDto: CreateUserDto) {
    const user = await this.validateUser(createUserDto); //якщо користувач існує і пароль вірний то в змінну прийде користуач
    return this.generateToken(user); //і з цього користувача ми згенеруємо токен
  }

  async registration(createUserDto: CreateUserDto) {
    const candidate = await this.userService.getUserByEmail( 
      createUserDto.email,
    );
    if (candidate) { //перевірка юзера на унікальність за email
      throw new HttpException('user is alredy exist', HttpStatus.BAD_REQUEST);
    } else {
      const hashPassword = await bcrypt.hash(createUserDto.password, 10); //хешування парлю (перший параметр це даніб другий це сіль)
      const user = await this.userService.createUser({
        ...createUserDto,
        password: hashPassword,
      }); // створення безпечного юзера з захешованим паролем
      return this.generateToken(user); //повертаємо токен користвуча на клієнт
    }
  }
  async generateToken(user: User) {
    const payload = { //змінна з якої буде створено токен
      email: user.email,
      id: user.id,
    };
    return {
      token: this.jwtService.sign(payload), // генерація токену
    };
  }
}
