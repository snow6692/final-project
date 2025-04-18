// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";
// import { config } from "../config/config";
// import prisma from "../config/prisma";
// import { userTypes } from "../types/user.types";

// // Define custom request interface
// interface AuthenticatedRequest extends Request {
//   userId?: string;
//   user?: userTypes;
// }

// export const protect = async (
//   req: AuthenticatedRequest, // Use custom interface
//   res: Response,
//   next: NextFunction
// ) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ message: "Not authorized" });
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, config.JWT_SECRET) as { userId: string };
//     req.userId = decoded.userId;
//     const user = await prisma.user.findUnique({
//       where: {
//         id: req.userId,
//       },
//       include: {
//         images: true,
//         notifications: true,
//         outfits: true,
//       },
//     });
//     if (!user) {
//       return res.status(401).json({ message: "User not found" });
//     }
//     req.user = user as userTypes;

//     next();
//   } catch (err) {
//     return res.status(401).json({ message: "Invalid token" });
//   }
// };

import { Request as ExpressRequest, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/config";
import prisma from "../config/prisma";
import { userTypes } from "../types/user.types";
import { CustomRequest } from "../types/express";

// Define a custom Request type locally

export const protect = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as { userId: string };
    req.userId = decoded.userId;
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: { images: true, notifications: true, outfits: true },
    });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user as userTypes;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
