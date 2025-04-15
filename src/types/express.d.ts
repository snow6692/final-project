import { Request as ExpressRequest } from "express";
import { userTypes } from "./user.types";

// Define a minimal User type that Passport might expect
interface PassportUser {
  id: string;
  [key: string]: any;
}

// Define CustomRequest to include both userTypes and Passport's user
export interface CustomRequest extends ExpressRequest {
  userId?: string;
  user?: userTypes | PassportUser;
}
