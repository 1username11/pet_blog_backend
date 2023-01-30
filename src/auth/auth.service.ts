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
    const user = await this.userService.getUserByEmail(createUserDto.email);
    const passwordEqual = await bcrypt.compare(
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
    const user = await this.validateUser(createUserDto);
    return this.generateToken(user);
  }

  async registration(createUserDto: CreateUserDto) {
    const candidate = await this.userService.getUserByEmail(
      createUserDto.email,
    );
    if (candidate) {
      throw new HttpException('user is alredy exist', HttpStatus.BAD_REQUEST);
    } else {
      const hashPassword = await bcrypt.hash(createUserDto.password, 10);
      const user = await this.userService.createUser({
        ...createUserDto,
        password: hashPassword,
      });
      return this.generateToken(user);
    }
  }
  async generateToken(user: User) {
    const payload = {
      email: user.email,
      id: user.id,
    };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
