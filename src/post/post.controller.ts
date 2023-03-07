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
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ParseIntPipe,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdatePostDto } from './dto/update-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageValidationPipe } from './image-validation.pipe';


@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async createPost(@Request() req, @Body() createPostDto: CreatePostDto, @UploadedFile(new ImageValidationPipe()) image) {
    const post = await this.postService.create(req.user.id, createPostDto, image);
    return post;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postService.findOneById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.postService.delete(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.updatePost(id, updatePostDto);
  }

  // @UseGuards(JwtAuthGuard)
  // @Get('/search')
  // async findByTags(@Param('tags') tags: string) {
  //   const tagsArray = tags.split('%20')
  //   const posts = await this.postService.findByTags(tagsArray);
  //   return posts;
  // }

}
