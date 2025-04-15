import dotenv from "dotenv";
dotenv.config();

export const config = {
  PORT: process.env.PORT!,
  JWT_SECRET: process.env.JWT_SECRET!,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
  DATABASE_URL: process.env.DATABASE_URL!,
  CLOUDINARY_NAME: process.env.CLOUDINARY_NAME!,
  CLOUDINARY_KEY: process.env.CLOUDINARY_API_KEY!,
  CLOUDINARY_SECRET: process.env.CLOUDINARY_API_SECRET!,
  SESSION_SECRET: process.env.SESSION_SECRET!,
};
