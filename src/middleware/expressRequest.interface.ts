import {Request} from "express";

// Extend the Express Request type
export interface RequestWithUser extends Request {
  userId?: string;
  role?: string;
}