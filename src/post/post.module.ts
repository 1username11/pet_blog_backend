import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { User } from 'src/user/entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User]), AuthModule],
  controllers: [PostController],
  providers: [PostService, JwtAuthGuard],
})
export class PostModule {}
