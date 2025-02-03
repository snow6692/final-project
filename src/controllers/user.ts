import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import prisma from "../utils/prisma";
import { userSchema } from "../config/validation";
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

export async function getUser(req: Request, res: Response) {
  res.status(200).json({ message: "Hello from getUser" });
}

export async function updateUser(req: Request, res: Response) {
  res.status(200).json({ message: "Hello from updateUser" });
}
