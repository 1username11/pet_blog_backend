import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'fs'
import * as path from 'path'
import * as uuid from 'uuid'

@Injectable()
export class FilesService {

  async createFile(file): Promise<string> {
    try {
      // Генеруємо унікальне ім'я для файлу
      const fileName = uuid.v4() + '.jpg';

      // Визначаємо шлях до директорії, де зберігатимуться файли
      const filePath = path.resolve('./src/static');

      // Перевіряємо, чи існує директорія, яку вказано в filePath
      if (!fs.existsSync(filePath)) {
        // Якщо директорії не існує, створюємо її
        await fs.promises.mkdir(filePath, { recursive: true });
      }

      // Записуємо файл на сервер з буферу
      await fs.promises.writeFile(path.join(filePath, fileName), file.buffer);

      // Повертаємо ім'я збереженого файлу
      return fileName;
    } catch (error) {
      // Якщо виникає помилка при створенні файлу, генеруємо HttpException зі статусом INTERNAL_SERVER_ERROR
      throw new HttpException('file error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
