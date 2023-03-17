import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { EntityManager, ILike } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { FilesService } from 'src/files/files.service';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    private fileService: FilesService,
    private readonly jwtService: JwtService,
  ) {}

  async create(
    user: User,
    createPostDto: CreatePostDto,
    image: any,
  ): Promise<Post> {
    try {
      const fileName = await this.fileService.createFile(image);
      // Створюємо новий пост і прив'язуємо його до юзера
      const post = await this.postRepository.create(createPostDto);
      post.image = fileName;
      post.user = user;

      // Зберігаємо пост у базі даних і повертаємо його
      const savedPost = await this.postRepository.save(post);
      return savedPost;
    } catch (error) {
      // Якщо сталась помилка, логуємо її і кидаємо виключення
      console.log(error);
      throw new Error('Failed to create post');
    }
  }

  async findAllByTags(tags: string): Promise<Post[]> {
    try {
      const posts = await this.postRepository
        .createQueryBuilder('post')
        .where({ tags: ILike(tags) })
        .getMany();
      return posts;
    } catch (error) {
      throw new HttpException(
        {
          message: 'search error',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  // SELECT * FROM post
  // WHERE tags ILIKE '%<tags>%'

  async findOneById(id: number): Promise<Post> {
    try {
      //return this.postRepository.findOneOrFail({where: {id}})
      const post = await this.postRepository.findOne({ where: { id } }); // Знаходимо пост за його ID
      if (!post) {
        // Якщо пост не знайдено, викидаємо виняток NotFoundException з повідомленням про відсутність посту з таким ID
        throw new NotFoundException(`Post with ID ${id} not found`);
      }
      return post; // Якщо все гаразд, повертаємо пост
    } catch (error) {
      // Якщо сталася помилка, виводимо повідомлення про помилку в консоль та викидаємо виняток InternalServerErrorException
      console.error(error);
      throw new InternalServerErrorException(); // не віддавати 500й статус код
    }
  }

  async delete(id: number, userId): Promise<DeleteResult | string> {
    try {
        const result = await this.postRepository
        .createQueryBuilder('post')
        .delete()
        .from(Post)
        .where('id = :id', { id })
        .andWhere('userId = :userId', { userId})
        .execute();
      if (result.affected !== 0) {
        return result;
      } else {
        return 'неможливо видалити пост'; //прокинути помилку
      }
    } catch (error) {
      console.log(error);
      throw new HttpException('error', HttpStatus.BAD_REQUEST);
    }
  }

  async updatePost(id: number, updatePostDto: UpdatePostDto, userId) {
    try {
      const { title, content, tags } = updatePostDto;
        const result = await this.postRepository
        .createQueryBuilder('post')
        .update(Post)
        .set({
          title: title,
          content: content,
          tags: tags,
        })
        .where('id = :id', { id })
        .andWhere('userId = :userId', { userId })
        .execute();
      if (result.affected === 0) {
        return 'посту не існує';
      }
      return result;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }
}
