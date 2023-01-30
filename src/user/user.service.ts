import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const user = await this.userRepository.create(createUserDto);
    this.userRepository.save(user);
    return user;
  }

  async findAll() {
    try {
      const users = await this.userRepository.find();
      return users;
    } catch (error) {
      console.log(error);
    }
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    return user;
  }
}
