import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    private fileService: FilesService,
  ) {}

  async create(user: User, createPostDto: CreatePostDto, image: any): Promise<Post> {
    try {
      const fileName = await this.fileService.createFile(image);
      // Створюємо новий пост і прив'язуємо його до юзера
      const post = await this.postRepository.create(createPostDto);
      post.image = fileName
      post.user= user;
       
      // Зберігаємо пост у базі даних і повертаємо його
      const savedPost = await this.postRepository.save(post);
      return savedPost;
    } catch (error) {
      // Якщо сталась помилка, логуємо її і кидаємо виключення
      console.log(error);
      throw new Error("Failed to create post");
    }
  }
  

  // async findByTags(tags: string[]): Promise<Post[]> {
  //   try {
  //     const posts = await this.postRepository.find({
  //       where: tags.map((tag) => ({ tags: Like(`%${tag}%`) })),
  //       // Перетворюємо масив тегів на масив об'єктів, 
  //       // кожен з яких містить умову пошуку одного тегу з використанням методу Like.
  //       // Використовуємо оператор OR, щоб пошук пости, що мають хоча б один тег зі списку.
  //     });
  //     return posts;
  //   } catch (error) {
  //     console.log(error);
  //     throw new Error('Failed to find posts by tags');
  //   }
  // }

  

async findOneById(id: number): Promise<Post> {
  try {
    const post = await this.postRepository.findOne({where: {id}}); // Знаходимо пост за його ID
    if (!post) { // Якщо пост не знайдено, викидаємо виняток NotFoundException з повідомленням про відсутність посту з таким ID
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post; // Якщо все гаразд, повертаємо пост
  } catch (error) { // Якщо сталася помилка, виводимо повідомлення про помилку в консоль та викидаємо виняток InternalServerErrorException
    console.error(error);
    throw new InternalServerErrorException();
  }
}

async delete(id): Promise<DeleteResult> {
    try {
      const deleted = await this.postRepository.delete(id);
      if (deleted.affected != 0) {
        return deleted;
      } else {
        throw new NotFoundException("This Post doesn't exist");
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async updatePost(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    try {
      const post = await this.postRepository.findOne({ where: { id } }); // Знаходимо пост за його ID
      if (!post) { // Якщо пост не знайдено, викидаємо виняток NotFoundException з повідомленням про відсутність посту з таким ID
        throw new NotFoundException(`Post with ID ${id} not found`);
      }
      const { title, content, tags } = updatePostDto; // Деструктуруємо об'єкт з даними для апдейту
      post.title = title || post.title; // Оновлюємо заголовок посту, якщо в об'єкті для апдейту передано нове значення, інакше залишаємо старе
      post.content = content || post.content; // Оновлюємо зміст посту, якщо в об'єкті для апдейту передано нове значення, інакше залишаємо старе
      post.tags = tags || post.tags; // Оновлюємо теги посту, якщо в об'єкті для апдейту передано нове значення, інакше залишаємо старі
      const updatedPost = await this.postRepository.save(post); // Зберігаємо оновлений пост у базу даних
      return updatedPost;
    } catch (error) { // Якщо сталася помилка, виводимо повідомлення про помилку в консоль та викидаємо виняток InternalServerErrorException
      console.error(error);
      throw new InternalServerErrorException();
    }
  }


  
}
