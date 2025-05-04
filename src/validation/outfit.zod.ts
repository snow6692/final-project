import { z } from "zod";
import prisma from "../config/prisma";

// Schema for creating an outfit
export const createOutfitSchema = z.object({
  images: z
    .array(z.string().uuid("Invalid image ID"), {
      required_error: "Images array is required",
    })
    .length(3, "An outfit must contain exactly 3 images")
    .refine(
      async (imageIds) => {
        // Fetch images with their categories
        const images = await prisma.image.findMany({
          where: { id: { in: imageIds } },
          include: { Category: true },
        });

        // Check if all image IDs are valid
        if (images.length !== 3) {
          return false; // Some images don't exist
        }

        // Check if images belong to different categories (Top, Bottom, Shoes)
        const categoryNames = images.map((image) => image.Category.name);
        const requiredCategories = ["Top", "Bottom", "Shoes"];
        const hasAllCategories = requiredCategories.every((category) =>
          categoryNames.includes(category)
        );
        const hasUniqueCategories = new Set(categoryNames).size === 3;

        return hasAllCategories && hasUniqueCategories;
      },
      {
        message:
          "An outfit must contain exactly one image from each category: Top, Bottom, Shoes",
      }
    ),
  favorite: z.boolean().default(false).optional(),
});

// Schema for updating an outfit (unchanged)
export const updateOutfitSchema = z.object({
  images: z
    .array(z.string().uuid("Invalid image ID"))
    .length(3, "An outfit must contain exactly 3 images")
    .refine(
      async (imageIds) => {
        const images = await prisma.image.findMany({
          where: { id: { in: imageIds } },
          include: { Category: true },
        });
        if (images.length !== 3) {
          return false;
        }
        const categoryNames = images.map((image) => image.Category.name);
        const requiredCategories = ["Top", "Bottom", "Shoes"];
        const hasAllCategories = requiredCategories.every((category) =>
          categoryNames.includes(category)
        );
        const hasUniqueCategories = new Set(categoryNames).size === 3;
        return hasAllCategories && hasUniqueCategories;
      },
      {
        message:
          "An outfit must contain exactly one image from each category: Top, Bottom, Shoes",
      }
    )
    .optional(),
  favorite: z.boolean().optional(),
});

export type CreateOutfitInput = z.infer<typeof createOutfitSchema>;
export type UpdateOutfitInput = z.infer<typeof updateOutfitSchema>;
