import { Response, Request } from "express";
import { userTypes } from "../types/user.types";
import prisma from "../config/prisma";
import { CustomRequest } from "../types/express";
import {
  ChangePasswordInput,
  changePasswordSchema,
  UpdateUserInput,
  updateUserSchema,
} from "../validation/user.zod";
import bcrypt from "bcryptjs";
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

export const updateUserById = async (req: CustomRequest, res: Response) => {
  const userId = req.userId as string;

  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    // Validate the request body using Zod
    const parsedData = updateUserSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({ message: parsedData.error.errors });
    }

    const data: UpdateUserInput = parsedData.data;

    // Prepare the update data
    const updateData: Partial<UpdateUserInput> = {};

    // Copy over fields that were provided
    if (data.name) updateData.name = data.name;
    if (data.image) updateData.image = data.image;
    if (data.Gender) updateData.Gender = data.Gender;
    if (data.dateOfBirth) updateData.dateOfBirth = data.dateOfBirth;

    // Update the user in the database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        dateOfBirth: updateData.dateOfBirth,
        Gender: updateData.Gender,
        image: updateData.image,
        name: updateData.name,
      },
      include: {
        images: true,
        notifications: true,
        outfits: true,
        sessions: true,
      },
    });

    // Exclude the password from the response
    const { password, ...userWithoutPassword } = updatedUser;

    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const changePassword = async (req: CustomRequest, res: Response) => {
  const userId = req.userId as string;

  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    // Validate the request body using Zod
    const parsedData = changePasswordSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({ message: parsedData.error.errors });
    }

    const data: ChangePasswordInput = parsedData.data;

    // Fetch the current user to check their authentication method
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user has a password (email/password user) or not (Google user)
    if (!user.password) {
      // Google user (no password in the database)
      return res
        .status(403)
        .json({ message: "Google-authenticated users cannot set a password" });
    }

    // Verify the current password
    const isMatch = await bcrypt.compare(data.currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(data.newPassword, 10);

    // Update the password in the database
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Server error" });
  }
};
