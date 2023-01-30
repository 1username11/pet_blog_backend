import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

config();
const { DB_PORT, HOST, USER, DB_NAME, PASSWORD } = process.env;

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: HOST,
  username: USER,
  port: +DB_PORT,
  password: PASSWORD,
  database: DB_NAME,
  migrations: ['dist/migrations/*.js'],
  entities: ['dist/**/*.entity.js'],
  synchronize: true,
};

export const dataSource = new DataSource(dataSourceOptions);
