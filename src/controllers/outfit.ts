import { Request, Response } from "express";
import { User } from "@prisma/client";
import { outfitSchema } from "../config/validation";
import prisma from "../config/prisma";

export const createOutfit = async (req: Request, res: Response) => {
  try {
    const user = req.user as User;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized: Please log in" });
    }

    const parsedData = outfitSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(422).json({ errors: parsedData.error.format() });
    }

    let { images, favorite } = parsedData.data;
    const userId = user.id;

    if (!Array.isArray(images)) {
      return res.status(400).json({ error: " should be an Array of images" });
    }

    const outfit = await prisma.outfit.create({
      data: {
        favorite,
        userId,

        images: {
          connect: images.map((imageId: string) => ({ id: imageId })),
        },
      },
      include: { images: true },
    });

    return res.status(201).json(outfit);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getUserOutfits = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: " UserId is required" });
    }
    const currentUser = req.user as User;
    if (currentUser.id !== userId) {
      return res
        .status(403)
        .json({ error: "Unauthorized: You can't view other users' outfits" });
    }

    const outfits = await prisma.outfit.findMany({
      where: { userId: userId as string },
      include: {
        images: true,
      },
    });

    return res.status(200).json(outfits);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: " Something went wrong " });
  }
};

export const deleteOutfit = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Id is required" });
    }
    const currentUser = req.user as User;
    if (!currentUser) {
      return res.status(401).json({ error: "Unauthorized: Please log in" });
    }

    const outfit = await prisma.outfit.findUnique({ where: { id } });

    if (!outfit) {
      return res.status(404).json({ message: "Outfit not found!" });
    }

    await prisma.outfit.delete({ where: { id } });

    return res.status(200).json({ message: "Outfit deleted!" });
  } catch (error) {
    return res.status(500).json({ message: " Something went wrong " });
  }
};

export const updateOutfit = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Id is required" });
    }
    const currentUser = req.user as User;
    if (!currentUser) {
      return res.status(401).json({ error: "Unauthorized: Please log in" });
    }
    const parsedData = outfitSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(422).json({ errors: parsedData.error.format() });
    }
    const { images, favorite } = parsedData.data;
    const userId = currentUser.id;
    const outfit = await prisma.outfit.findUnique({ where: { id } });
    if (!outfit) {
      return res.status(404).json({ message: "Outfit not found!" });
    }
    if (outfit.userId !== userId) {
      return res
        .status(403)
        .json({ error: "Unauthorized: You can't update other users' outfits" });
    }
    await prisma.outfit.update({
      where: { id },
      data: {
        favorite,
        images: {
          connect: images.map((imageId: string) => ({ id: imageId })),
        },
      },
    });
    return res.status(200).json({ message: "Outfit updated!" });
  } catch (error) {
    return res.status(500).json({ message: " Something went wrong " });
  }
};

export const getOutfitById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Id is required" });
    }
    const currentUser = req.user as User;
    if (!currentUser) {
      return res.status(401).json({ error: "Unauthorized: Please log in" });
    }

    const outfit = await prisma.outfit.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!outfit) {
      return res.status(404).json({ message: "Outfit not found!" });
    }
    if (outfit.userId !== currentUser.id) {
      return res
        .status(403)
        .json({ error: "Unauthorized: You can't view other users' outfits" });
    }

    return res.status(200).json(outfit);
  } catch (error) {
    return res.status(500).json({ message: " Something went wrong " });
  }
};
