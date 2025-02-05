import { NextFunction, Request, Response } from "express";

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
  