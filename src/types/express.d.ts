// src/types/express.d.ts
import { User } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: User | null; // Ensure `user` property on the request is typed as `User` or `null`
    }
  }
}
