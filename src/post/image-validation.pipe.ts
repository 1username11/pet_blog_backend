import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common'; // імпортуємо необхідні залежності

import { extname } from 'path'; // імпортуємо функцію для отримання розширення файлу з модуля 'path'

@Injectable()
export class ImageValidationPipe implements PipeTransform { // створюємо клас імплементуючи інтерфейс PipeTransform
  private readonly allowedExtensions = ['.jpg', '.jpeg', '.png']; // масив допустимих розширень файлів
  private readonly maxSize = 100 * 1024 * 1024; // максимальний розмір файлу, 100 МБ

  async transform(file: any) { // створюємо функцію-трансформатор, яка буде перевіряти файл
    
    const extension = extname(file.originalname); // отримуємо розширення файлу
    if (!this.allowedExtensions.includes(extension)) { // якщо розширення не входить до масиву допустимих розширень
      throw new BadRequestException(`File type ${extension} is not allowed`); // кидаємо помилку з повідомленням
    }

    if (file.size > this.maxSize) { // якщо розмір файлу перевищує максимальний розмір
      throw new BadRequestException('File is too large'); // кидаємо помилку з повідомленням
    }

    return file; // якщо файл відповідає всім критеріям, повертаємо його
  }
}
