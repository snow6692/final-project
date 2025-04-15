import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import bcrypt from "bcryptjs";
import prisma from "../config/prisma";
import { signInZod, signUpZod } from "../validation/auth.zod";
import { config } from "../config/config";

export const signup = async (req: Request, res: Response) => {
  const parse = signUpZod.safeParse(req.body);

  if (!parse.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: parse.error.flatten().fieldErrors,
    });
  }

  const { email, password } = parse.data;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
      include: {
        images: true,
        outfits: true,
        notifications: true,
        sessions: true,
      },
    });

    const token = jwt.sign({ userId: user.id }, config.JWT_SECRET, {
      expiresIn: "7d",
    });

    const { password: _, ...userWithoutPassword } = user;
    return res.status(201).json({ token, user: userWithoutPassword });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const signIn = async (req: Request, res: Response) => {
  const parse = signInZod.safeParse(req.body);

  if (!parse.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: parse.error.flatten().fieldErrors,
    });
  }

  const { email, password } = parse.data;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
