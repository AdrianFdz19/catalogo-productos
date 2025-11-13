import {config} from 'dotenv';

config();

export const env = {
  nodeEnv: process.env.NODE_ENV,
  secret: process.env.JWT_SECRET,
  db: {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    name: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ext_url: process.env.EXTERNAL_DATABASE_URL,
    int_url: process.env.INTERNAL_DATABASE_URL
  },
  cloudinary: {
    name: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET
  }
};
