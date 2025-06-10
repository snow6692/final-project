import prisma from "../config/prisma";
import { Response } from "express";
import { CustomRequest } from "../types/express";
// import { userTypes } from "../types/user.types";

export async function getAllCategories(req: CustomRequest, res: Response) {
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

export const getCategoryById = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Category ID is required" });
    }

    // const user = req.user as userTypes;
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized: Please log in" });
    }

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        images: {
          where: { userId: user.id }, // Filter images by userId
          select: {
            id: true,
            url: true,
            categoryId: true,
            createdAt: true,
          },
        },
      },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
