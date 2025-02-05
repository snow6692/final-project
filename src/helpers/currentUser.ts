import { User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import prisma from "../utils/prisma";

export async function currentUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Check if the user is authenticated
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized: Please log in" });
    }

    // Get the current user from the session
    const DbUser = req.user as User;
    const userId = DbUser.id; // `req.user` is now typed as `User`

    if (!userId) {
      return res.status(401).json({ error: "User not found" });
    }

    // Fetch user data from the database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        categories: true,
        images: true,
        outfits: true,
        notifications: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Send user data as response
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
}
