import prisma from "../config/prisma";
import {  Response } from "express";
import { CustomRequest } from "../types/express";

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

export async function getCategoryById(req: CustomRequest, res: Response) {
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


