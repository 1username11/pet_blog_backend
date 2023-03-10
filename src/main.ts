import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const PORT = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule); //створення екземпляру застосунку http://nestjs-doc.exceptionfound.com/interfaces/inestapplication.html
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  await app.listen(PORT, 'localhost');
  console.log(`server has been started on port: ${PORT}`);
}
bootstrap(); //асинхронна функція яка є точкою входу в застосунок
