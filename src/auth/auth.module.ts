import { Module } from '@nestjs/common';
import { forwardRef } from '@nestjs/common/utils';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    forwardRef(() => UserModule),
    JwtModule.register({
      secret: process.env.PRIVATE || 'secret',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
