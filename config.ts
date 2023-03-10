import { config } from "dotenv";

config(); //виклик функції присвоює змінній process.env значення з файлу .env
export const {
  POSTGRES_HOST,
  POSTGRES_USER,
  POSTGRES_DB,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
  JWTSECRET,
  OPEN_API_KEY,
} = process.env;