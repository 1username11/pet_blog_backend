import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  POSTGRES_HOST,
  POSTGRES_USER,
  POSTGRES_PORT,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
} from 'config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: POSTGRES_HOST,
        username: POSTGRES_USER,
        port: +POSTGRES_PORT,
        password: POSTGRES_PASSWORD,
        database: POSTGRES_DB,
        migrations: ['dist/migrations/*.js'],
        entities: ['dist/**/*.entity.js'],
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
