import { Response, Request } from "express";
import { userTypes } from "../types/user.types";
import prisma from "../config/prisma";
import { CustomRequest } from "../types/express";
import { passwordZod, userZod } from "../validation/user.zod";
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
    // Parse JSON data from the request body
    const parsedData = userZod.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({ message: parsedData.error.errors });
    }

    const data: userZod = parsedData.data;
    const updateData: any = {
      name: data.name,
      dateOfBirth: data.dateOfBirth,
    };

    // Handle image upload if present
    if (req.file) {
      const imageUrl = (req.file as any).path; // Cloudinary URL
      updateData.image = imageUrl; // Store the URL in the user record
    } else if (req.body.image === "") {
      // Handle case where user wants to remove the image
      updateData.image = null;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      include: {
        images: true,
        notifications: true,
        outfits: true,
        sessions: true,
      },
    });

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
    const parsedData = passwordZod.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({ message: parsedData.error.errors });
    }

    const data: passwordZod = parsedData.data;

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
