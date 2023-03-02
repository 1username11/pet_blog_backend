import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { User } from 'src/user/entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { FilesModule } from 'src/files/files.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User]), AuthModule, UserModule, JwtModule, FilesModule],
  controllers: [PostController],
  providers: [PostService, JwtAuthGuard],
})
export class PostModule {}
