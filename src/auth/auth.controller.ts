import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../config/prisma";
import { signUpZod } from "../validation/auth.schema";

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
    });

    const { password: _, ...userWithoutPassword } = user;

    return res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
