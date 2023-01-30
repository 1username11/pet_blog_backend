import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty({
    message: 'title is required',
  })
  title: string;

  @IsString({
    message: 'content must be a string',
  })
  @IsNotEmpty({
    message: 'content is required',
  })
  content: string;
}
