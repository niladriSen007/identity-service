import { config } from 'dotenv';
config();
const MONGO_URI = process.env.MONGO_URI
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'secret';
const JWT_REFRESH_TOKEN_EXPIRATION = process.env.JWT_REFRESH_TOKEN_EXPIRATION || 30*24*60*60;
const JWT_ACCESS_TOKEN_EXPIRATION  = process.env.JWT_ACCESS_TOKEN_EXPIRATION || 15*60;
const JWT_REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET_KEY || 'refresh_secret';
const REDIS_URI = process.env.REDIS_URI || 'redis://localhost:6379'

export const config_env = {
  MONGO_URI,
  PORT,
  NODE_ENV,
  JWT_SECRET_KEY,
  JWT_REFRESH_SECRET_KEY,
  JWT_REFRESH_TOKEN_EXPIRATION,
  JWT_ACCESS_TOKEN_EXPIRATION,
  REDIS_URI
}