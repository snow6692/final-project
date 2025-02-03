import { NextFunction, Request, Response } from "express";
import { loginSchema } from "../config/validation";
import passport from "passport";
import "../services/passport";
import { User } from "@prisma/client";
import prisma from "../utils/prisma";
export function login(req: Request, res: Response, next: NextFunction) {
  try {
    const parsedData = loginSchema.safeParse(req.body);

    if (!parsedData.success) {
      return res.status(422).json({ errors: parsedData.error.format() });
    }

    const { email, password } = parsedData.data;
    passport.authenticate("local", (error: any, user: User, info: any) => {
      if (error) {
        return res.status(500).json({ message: "Something went wrong" });
      }

      if (!user) {
        res.status(401).json({ info });
      }

      req.login(user, async () => {
        if (error) {
          return res.status(500).json({ message: "Something went wrong" });
        }

        const session = await prisma.session.create({
          data: {
            userId: user.id,
            sess: {}, // You can store session data here if needed
            expire: new Date(Date.now() + 1000 * 60 * 60 * 24), // Set session expiration (1 day)
          },
        });
        return res.status(200).json(user);
      });
    })(req, res, next);
  } catch (error) {}
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.isAuthenticated()) {
      // Cast req.user to User type to access the id property
      const user = req.user as User;

      // Delete the session from the database
      await prisma.session.deleteMany({
        where: {
          userId: user.id, // Now TypeScript knows `user` has `id`
        },
      });

      // Log the user out from Passport
      req.logout((err) => {
        if (err) {
          return next(err);
        }
        return res.status(200).json({ message: "Logged out successfully" });
      });
    } else {
      return res.status(401).json({ message: "No user logged in" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error });
  }
}
export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Unauthorized: Please log in" });
}
