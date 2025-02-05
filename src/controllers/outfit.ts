import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * ✅ إنشاء Outfit جديد مع صور مرتبطة به
 */
export const createOutfit = async (req: Request, res: Response) => {
  try {
    const { userId, name, imageIds } = req.body;

    if (!userId || !name || !imageIds || !Array.isArray(imageIds)) {
      return res.status(400).json({ message: "بيانات غير كاملة" });
    }

    const outfit = await prisma.outfit.create({
      data: {
        name,
        userId,
        images: {
          create: imageIds.map((imageId: string) => ({ imageId })),
        },
      },
      include: { images: true },
    });

    return res.status(201).json(outfit);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "خطأ في السيرفر" });
  }
};

/**
 * ✅ جلب جميع Outfits للمستخدم
 */
export const getUserOutfits = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "يجب إرسال معرف المستخدم" });
    }

    const outfits = await prisma.outfit.findMany({
      where: { userId: userId as string },
      include: { images: { include: { image: true } } }, // ✅ جلب الصور المرتبطة بالأوتفيت
    });

    return res.json(outfits);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "خطأ في السيرفر" });
  }
};

/**
 * ✅ حذف Outfit معين
 */
export const deleteOutfit = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const outfit = await prisma.outfit.findUnique({ where: { id } });

    if (!outfit) {
      return res.status(404).json({ message: "Outfit غير موجود" });
    }

    await prisma.outfit.delete({ where: { id } });

    return res.json({ message: "تم حذف Outfit بنجاح" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "خطأ في السيرفر" });
  }
};
