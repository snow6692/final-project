import { categorySchema } from "../config/validation";
import prisma from "../utils/prisma";
import { Request, Response } from "express";

export async function createCategory(req: Request, res: Response) {
  try {
    // Step 1: Check if the image file exists
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    // Step 2: Validate incoming category data using Zod
    const parsedCategories = categorySchema.safeParse(req.body);
    if (!parsedCategories.success) {
      return res.status(422).json({ errors: parsedCategories.error.format() });
    }

    const { name } = parsedCategories.data;

    // Step 3: Extract Cloudinary URL after file upload
    const imageUrl = (req.file as any).path; // Extract Cloudinary image URL (it might be available directly)

    // Step 4: Create category in the database with image URL
    await prisma.category.create({
      data: {
        name,
        image: imageUrl,
      },
    });

    return res.status(201).json({ message: "Category created successfully" });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({ error: "Something went wrong" });
  }
}

export async function deleteCategory(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await prisma.category.delete({
      where: { id },
    });
    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({ error: "Something went wrong" });
  }
}

export async function updateCategoryById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const parsedCategories = categorySchema.safeParse(req.body);
    if (!parsedCategories.success) {
      return res.status(422).json({ errors: parsedCategories.error.format() });
    }

    const { name } = parsedCategories.data;
    const imageUrl = (req.file as any).path; // Extract Cloudinary image URL (it might be available directly)

    await prisma.category.update({
      where: { id },
      data: {
        name,
        image: imageUrl, // Update image if a new one is provided
      },
    });

    return res.status(200).json({ message: "Category updated successfully" });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({ error: "Something went wrong" });
  }
}

export async function getAllCategories(req: Request, res: Response) {
  try {
    const categories = await prisma.category.findMany();
    if (!categories) {
      res
        .status(404)
        .json({ message: "No categories found. Create new  one!" });
    }
    res.send(categories).status(200);
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
}

export async function getCategoryById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const category = await prisma.category.findUnique({
      where: { id },
    });
    if (!category) {
      res.status(404).json({ message: "Category not found" });
    }
    res.send(category).status(200);
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
}
