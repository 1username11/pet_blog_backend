import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

config();//виклик функції присвоює змінній process.env значення з файлу .env
export const {
  POSTGRES_HOST,
  POSTGRES_USER,
  POSTGRES_DB,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
  JWTSECRET,
  OPEN_API_KEY
} = process.env; //деструктуризація process.env

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: POSTGRES_HOST,
  username: POSTGRES_USER,
  port: +POSTGRES_PORT,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
  migrations: ['dist/migrations/*.js'],
  entities: ['dist/**/*.entity.js'],
  synchronize: false,
}; //  DataSourceOptions - змінна з налаштуваннями для екзмпляру классу DataSource

export const dataSource = new DataSource(dataSourceOptions);
