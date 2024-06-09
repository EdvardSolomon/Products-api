import { config } from 'dotenv';

config();

export default {
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET,
  DATABASE_URL: process.env.DATABASE_URL,
  PEPPER: process.env.PEPPER,
};
