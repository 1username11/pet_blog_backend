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
  Res,
  Query,
  Req,
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
  async createPost(
    @Request() req,
    @Body() createPostDto: CreatePostDto,
    @UploadedFile(new ImageValidationPipe()) image,
  ) {
    const post = await this.postService.create(
      req.user.id,
      createPostDto,
      image,
    );
    return post;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postService.findOneById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.postService.delete(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req,
  ) {
    return this.postService.updatePost(id, updatePostDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('search')
  async findAllByTags(@Query('tags') tags: string) {
    const posts = await this.postService.findAllByTags(tags);
    return posts;
  }
}
