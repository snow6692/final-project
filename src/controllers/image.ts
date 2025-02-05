import { Request, Response } from "express";
import prisma from "../utils/prisma";
import { User } from "@prisma/client";

import { imageSchema } from "../config/validation";

export const createImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }
    const parsedImageSchema = imageSchema.safeParse(req.body);
    if (!parsedImageSchema.success) {
      return res.status(422).json({ errors: parsedImageSchema.error.format() });
    }

    let { categoryId, userId } = parsedImageSchema.data;

    const dbUser = req.user as User;
    userId = dbUser.id;
    console.log(userId);

    const imageUrl = (req.file as any).path;
    const image = await prisma.image.create({
      data: {
        url: imageUrl,
        categoryId,
        userId,
      },
    });

    res
      .status(201)
      .json({ message: "Image uploaded successfully", image: image });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteImageById = async (req: Request, res: Response) => {
  try {
    const dbUser = req.user as User;
    if (!dbUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userId = dbUser.id;

    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Image ID is required" });
    }
    const existingImage = await prisma.image.findUnique({
      where: {
        userId,
        id,
      },
    });
    if (!existingImage) {
      return res.status(404).json({ message: "Image not found" });
    }
    const image = await prisma.image.delete({
      where: {
        id,
      },
    });
    res
      .status(200)
      .json({ message: "Image deleted successfully", image: image });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateImageById = async (req: Request, res: Response) => {
  try {
    const dbUser = req.user as User;
    if (!dbUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userId = dbUser.id;
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Image ID is required" });
    }
    const existingImage = await prisma.image.findUnique({
      where: {
        userId,
        id,
      },
    });
    const imageUrl = (req.file as any).path;

    if (!existingImage) {
      return res.status(404).json({ message: "Image not found" });
    }
    const parsedImageSchema = imageSchema.safeParse(req.body);
    if (!parsedImageSchema.success) {
      return res.status(422).json({ errors: parsedImageSchema.error.format() });
    }
    const { categoryId } = parsedImageSchema.data;
    const updatedImage = await prisma.image.update({
      where: {
        id,
        userId,
      },
      data: {
        categoryId,
        url: imageUrl,
      },
    });

    res
      .status(200)
      .json({ message: "Image updated successfully", image: updatedImage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getImageById = async (req: Request, res: Response) => {};

export const getImagesByCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    if (!categoryId) {
      return res.status(400).json({ message: "Category ID is required" });
    }
    const images = await prisma.image.findMany({
      where: {
        categoryId,
      },
    });
    res.send(images).status(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getImagesByUserId = async (req: Request, res: Response) => {
  try {
    const dbUser = req.user as User;
    if (!dbUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userId = dbUser.id;
    const images = await prisma.image.findMany({
      where: {
        userId,
      },
    });
    res.send(images).status(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
