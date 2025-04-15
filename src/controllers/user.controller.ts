import { Response, Request } from "express";
import { userTypes } from "../types/user.types";
import prisma from "../config/prisma";
import { CustomRequest } from "../types/express";

export const getUserById = async (req: CustomRequest, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const currentUser = req.user as userTypes;

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(currentUser);
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteUserById = async (req: CustomRequest, res: Response) => {
  const userId = req.userId as string;

  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    await prisma.user.delete({
      where: { id: userId },
    });

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
};
