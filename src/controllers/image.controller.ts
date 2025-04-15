import { Request, Response } from "express";
import prisma from "../config/prisma";
import { CustomRequest } from "../types/express";
import {
  createImageSchema,
  updateImageSchema,
  CreateImageInput,
  UpdateImageInput,
} from "../validation/image.zod";

export async function createImage(req: CustomRequest, res: Response) {
  try {
    // Step 1: Check if the image file exists
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    // Step 2: Validate incoming data using Zod
    const parsedData = createImageSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(422).json({ errors: parsedData.error.format() });
    }

    const data: CreateImageInput = parsedData.data;

    // Step 3: Validate that the category exists
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });
    if (!category) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    // Step 4: Extract Cloudinary URL after file upload
    const imageUrl = (req.file as any).path;

    // Step 5: Create the image in the database
    const image = await prisma.image.create({
      data: {
        url: imageUrl,
        userId: req.userId as string, // Use req.userId from protect middleware
        categoryId: data.categoryId,
      },
    });

    return res.status(201).json(image);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}

export async function deleteImageById(req: CustomRequest, res: Response) {
  try {
    const { id } = req.params;

    // Step 1: Fetch the image and check ownership
    const image = await prisma.image.findUnique({
      where: { id },
    });
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }
    if (image.userId !== req.userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this image" });
    }

    // Step 2: Delete the image
    await prisma.image.delete({
      where: { id },
    });

    return res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}

export async function updateImageById(req: CustomRequest, res: Response) {
  try {
    const { id } = req.params;

    // Step 1: Fetch the image and check ownership
    const image = await prisma.image.findUnique({
      where: { id },
    });
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }
    if (image.userId !== req.userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this image" });
    }

    // Step 2: Validate incoming data using Zod
    const parsedData = updateImageSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(422).json({ errors: parsedData.error.format() });
    }

    const data: UpdateImageInput = parsedData.data;

    // Step 3: Validate category if provided
    if (data.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: data.categoryId },
      });
      if (!category) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
    }

    // Step 4: Prepare update data
    const updateData: Partial<UpdateImageInput & { url?: string }> = {};
    if (data.categoryId) updateData.categoryId = data.categoryId;
    if (req.file) updateData.url = (req.file as any).path;

    // Step 5: Update the image
    const updatedImage = await prisma.image.update({
      where: { id },
      data: updateData,
    });

    return res.status(200).json(updatedImage);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}

export async function getImageById(req: CustomRequest, res: Response) {
  try {
    const { id } = req.params;

    // Step 1: Fetch the image and check ownership
    const image = await prisma.image.findUnique({
      where: { id },
      include: { Category: true, outfits: true }, // Include the category to return its name
    });
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }
    if (image.userId !== req.userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to view this image" });
    }

    return res.status(200).json(image);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}

export async function getImagesByCategory(req: CustomRequest, res: Response) {
  try {
    const { categoryId } = req.params;

    // Step 1: Validate that the category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    // Step 2: Fetch images for the category, but only for the authenticated user
    const images = await prisma.image.findMany({
      where: {
        categoryId,
        userId: req.userId, // Ensure only the user's images are returned
      },
      include: { Category: true, outfits: true }, // Include the category to return its name
    });

    return res.status(200).json(images);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}

export async function getImagesByUserId(req: CustomRequest, res: Response) {
  try {
    // Step 1: Fetch images for the authenticated user
    const images = await prisma.image.findMany({
      where: {
        userId: req.userId, // Use req.userId from protect middleware
      },
      include: { Category: true, outfits: true }, // Include the category to return its name
    });

    return res.status(200).json(images);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
