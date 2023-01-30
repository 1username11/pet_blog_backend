import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createPost(@Request() req, @Body() createPostDto: CreatePostDto) {
    const post = await this.postService.create(req.user.id, createPostDto);
    return post;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.postService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.postService.delete(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: number, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(id, updatePostDto);
  }
}
