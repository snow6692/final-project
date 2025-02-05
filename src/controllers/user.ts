import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import prisma from "../utils/prisma";
import { userSchema } from "../config/validation";
import { User } from "@prisma/client";
export async function createUser(req: Request, res: Response) {
  try {
    const parsedData = userSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(422).json({ errors: parsedData.error.format() });
    }

    const { email, name, password } = parsedData.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hashSync(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    return res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
}

export async function getCurrentUser(
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
export async function updateUser(req: Request, res: Response) {
  res.status(200).json({ message: "Hello from updateUser" });
}
