import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async create(user: User, createPostDto: CreatePostDto): Promise<Post> {
    try {
      const post = await this.postRepository.create(createPostDto);
      post.user = user;
      this.postRepository.save(post);
      return post;
    } catch (error) {
      console.log(error);
    }
  }

  async findOne(id): Promise<Post> {
    try {
      const post = await this.postRepository.findOne({
        where: { id },
      });
      if (!post) {
        throw new NotFoundException("This Post doesn't exist");
      } else {
        return post;
      }
    } catch (error) {
      console.log(error);
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
    }
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<any> {
    try {
      const updatedPost = await this.postRepository.findOne({ where: { id } });
      if (updatedPost) {
        updatedPost.title = updatePostDto.title;
        updatedPost.content = updatePostDto.content;
        await this.postRepository.update(id, updatedPost);
        return updatedPost;
      } else {
        throw new NotFoundException("This Post doesn't exist");
      }
    } catch (error) {
      console.log(error);
    }
  }
}
