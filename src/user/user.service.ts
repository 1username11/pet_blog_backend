import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>, // Repository - це класс для роботи з Entity (пошук, збереження, видалення і т.д. в БД)
  ) {} //ін'єкція userRepository

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      // Створити новий об'єкт користувача з даними, отриманими з об'єкта `createUserDto`
      const user = this.userRepository.create(createUserDto);

      // Зберегти об'єкт користувача до бази даних з використанням методу `save` об'єкта `userRepository`
      await this.userRepository.save(user);

      // Повернути об'єкт створеного користувача
      return user;
    } catch (error) {
      // Якщо виникає будь-яка помилка при збереженні користувача до бази даних, перехоплюємо її та повертаємо нову помилку
      // з повідомленням про нездатність створити користувача з використанням даної інформації.
      throw new Error(
        `Unable to create user with data: ${JSON.stringify(createUserDto)}`,
      );
    }
  }

  async findAll(): Promise<User[]> {
    try {
      // Отримати всіх користувачів з бази даних з використанням методу `find` об'єкта `userRepository`
      const users = await this.userRepository.find();

      // Повернути масив користувачів
      return users;
    } catch (error) {
      // Якщо виникає будь-яка помилка при отриманні користувачів з бази даних, перехоплюємо її та повертаємо нову помилку
      // з повідомленням про нездатність отримати користувачів з бази даних.
      throw new Error(`Unable to find users: ${error.message}`);
    }
  }

  async getUserByEmail(email: string): Promise<User> {
    try {
      // Знайти користувача за електронною адресою з використанням методу `findOne` об'єкта `userRepository`
      const user = await this.userRepository
        .createQueryBuilder()
        .select('user')
        .from(User, 'user')
        .where('user.email = :email', { email })
        .getOne();
      return user;
    } catch (error) {
      // Якщо виникає будь-яка помилка при виконанні запиту до бази даних, перехоплюємо її та повертаємо нову помилку
      // з повідомленням про нездатність знайти користувача за допомогою даної адреси електронної пошти.
      throw new Error(`Unable to fetch user with email ${email}`);
    }
  }

  async getUserById(id: string): Promise<User> {
    try {
      // Знайти користувача за електронною адресою з використанням методу `findOne` об'єкта `userRepository`
      const user = await this.userRepository
        .createQueryBuilder()
        .select('user')
        .from(User, 'user')
        .where('user.id = :id', { id })
        .getOne();
      return user;
    } catch (error) {
      // Якщо виникає будь-яка помилка при виконанні запиту до бази даних, перехоплюємо її та повертаємо нову помилку
      // з повідомленням про нездатність знайти користувача за допомогою даної адреси електронної пошти.
      throw new Error(`Unable to fetch user with email ${id}`);
    }
  }

  async insertUser (createUserDto: CreateUserDto){
    const hashPassword = await bcrypt.hash(createUserDto.password, 10)
    const user = await this.userRepository.create({
      ...createUserDto,
      password:hashPassword
    })
    const queryBuilder = await this.userRepository
      .createQueryBuilder()
      .insert()
      .into(User)
      .values(user)
      .execute()
      return user
  }
  
}
