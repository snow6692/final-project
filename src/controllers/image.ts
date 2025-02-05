import { Request, Response } from "express";
import prisma from "../utils/prisma";
import { User } from "@prisma/client";
import cloudinary from "../utils/cloudinary";

export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const dbUser = req.user as User;
    const userId = dbUser.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const imageUrl = (req.file as any).path;

    // 🟢 حفظ الصورة في قاعدة البيانات
    const image = await prisma.image.create({
      data: {
        name: req.file.originalname,
        url: imageUrl,
        userId,
        categoryId: "your_category_id", // 🚀 عدّلها لاحقًا حسب الفئة المختارة
      },
    });

    res.status(201).json({ message: "Image uploaded successfully", image });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
