import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>, // Repository - це класс для роботи з Entity (пошук, збереження, видалення і т.д. в БД)
  ) {} //ін'єкція userRepository

  async createUser(createUserDto: CreateUserDto) {
    try {
      const user = await this.userRepository.create(createUserDto); 
      this.userRepository.save(user);
      return user;
    } catch (error) {
      console.log(error)
    }
  }

  async findAll(){
    try {
      const users = await this.userRepository.find();
      return users;
    } catch (error) {
      console.log(error);
    }
  }

  async getUserByEmail(email: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
      });
      return user;
    } catch (error) {
      console.log(error)
    }
  }
}
