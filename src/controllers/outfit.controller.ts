import { Response } from "express";
import {
  createOutfitSchema,
  CreateOutfitInput,
  UpdateOutfitInput,
} from "../validation/outfit.zod";
import prisma from "../config/prisma";
import { userTypes } from "../types/user.types";
import { CustomRequest } from "../types/express";

export const createOutfit = async (req: CustomRequest, res: Response) => {
  try {
    const user = req.user as userTypes;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized: Please log in" });
    }

    // Log the request body to debug
    console.log("Request body:", req.body);

    // Use safeParseAsync since the schema includes async validation
    const parsedData = await createOutfitSchema.safeParseAsync(req.body);
    if (!parsedData.success) {
      console.log("Validation errors:", parsedData.error.format());
      return res.status(422).json({ errors: parsedData.error.format() });
    }

    const data: CreateOutfitInput = parsedData.data;
    const { images, favorite } = data;
    const userId = user.id;

    // Validate that the user owns the images
    const userImages = await prisma.image.findMany({
      where: { id: { in: images }, userId },
    });
    console.log("User images found:", userImages);
    if (userImages.length !== images.length) {
      return res
        .status(403)
        .json({ error: "You can only use your own images in an outfit" });
    }

    // Check for duplicate outfit
    const existingOutfits = await prisma.outfit.findMany({
      where: {
        userId,
        images: {
          some: { id: { in: images } }, // Filter outfits that contain at least one of the images
        },
      },
      include: { images: true },
    });

    // Check if any existing outfit has the exact same three images
    const newImageSet = new Set(images.sort()); // Sort to ensure consistent comparison
    const isDuplicate = existingOutfits.some((outfit) => {
      // Get the image IDs of the existing outfit
      const existingImageIds = outfit.images.map((image) => image.id).sort();
      const existingImageSet = new Set(existingImageIds);

      // Compare the sets
      if (newImageSet.size !== existingImageSet.size) {
        return false; // If the sizes are different, they can't be the same
      }

      return [...newImageSet].every((id) => existingImageSet.has(id));
    });

    if (isDuplicate) {
      return res.status(400).json({ error: "This outfit already exists" });
    }

    // Create the outfit
    const outfit = await prisma.outfit.create({
      data: {
        favorite: favorite ?? false,
        userId,
        images: {
          connect: images.map((imageId: string) => ({ id: imageId })),
        },
      },
      include: { images: { include: { Category: true } } },
    });

    return res.status(201).json(outfit);
  } catch (error) {
    console.error("Error creating outfit:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteOutfit = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Outfit ID is required" });
    }

    const user = req.user as userTypes;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized: Please log in" });
    }

    const outfit = await prisma.outfit.findUnique({ where: { id } });
    if (!outfit) {
      return res.status(404).json({ message: "Outfit not found" });
    }

    if (outfit.userId !== user.id) {
      return res
        .status(403)
        .json({ error: "Unauthorized: You can only delete your own outfits" });
    }

    await prisma.outfit.delete({ where: { id } });

    return res.status(200).json({ message: "Outfit deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getUserOutfits = async (req: CustomRequest, res: Response) => {
  try {
    const user = req.user as userTypes;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized: Please log in" });
    }

    const outfits = await prisma.outfit.findMany({
      where: { userId: user.id },
      include: { images: { include: { Category: true } } },
    });

    return res.status(200).json(outfits);
  } catch (error) {
    console.error("Error fetching outfits:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateOutfit = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { favorite } = req.body;
    const user = req.user as userTypes;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized: Please log in" });
    }

    const outfit = await prisma.outfit.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!outfit) {
      console.log("Outfit not found:", id);
      return res.status(404).json({ error: "Outfit not found" });
    }

    if (outfit.userId !== user.id) {
      return res
        .status(403)
        .json({ error: "You can only modify your own outfits" });
    }

    const updatedOutfit = await prisma.outfit.update({
      where: { id },
      data: { favorite: favorite ?? false },
      include: { images: { include: { Category: true } } },
    });

    return res.status(200).json(updatedOutfit);
  } catch (error) {
    console.error("Error updating outfit:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
