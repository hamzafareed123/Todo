import dotenv from "dotenv";

dotenv.config();

export const ENV = {
  PORT: process.env.PORT,
  MONGO_URL: process.env.MONGO_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  ARCJET_ENV: process.env.ARCJET_ENV,
  ARCJET_KEY: process.env.ARCJET_KEY,
  NODE_ENV: process.env.NODE_ENV,
  CLIENT_URL:process.env.CLIENT_URL,
};
