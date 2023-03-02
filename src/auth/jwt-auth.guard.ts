import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Отримати токен з заголовку Authorization
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      // Якщо заголовок Authorization відсутній - блокуємо запит
      return false;
    }

    // Виділити токен з заголовку Authorization
    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      // Якщо заголовок не містить токен у форматі Bearer Token - блокуємо запит
      return false;
    }

    try {
      // Перевірити токен за допомогою JwtService
      const decoded = this.jwtService.verify(token);
      // Зберегти дані користувача в request для подальшого використання
      request.user = decoded;
      // Пропустити запит
      return true;
    } catch (err) {
      // Якщо токен не валідний - блокуємо запит
      return false;
    }
  }
}
