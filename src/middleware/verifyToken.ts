import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import {InternalServerErrorException, UnauthorizedException} from "@nestjs/common";

interface JwtPayload {
  userId: string;
  role: string;
}

// Extend the Express Request type
interface RequestWithUser extends Request {
  userId?: string;
  role?: string;
}

const verifyToken = async(req: RequestWithUser, res: Response) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      throw new UnauthorizedException({message: "Invalid token"});
    }
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    if (!jwtSecretKey) {
      throw new Error("JWT_SECRET_KEY is not defined");
    }
   
    const decoded = jwt.verify(token, jwtSecretKey) as JwtPayload;
    if (!decoded) {
      throw new UnauthorizedException({message: "Invalid token or not valid"});
    }
    req.userId = decoded.userId;
    req.role = decoded.role;
  } catch (error) {
    throw new InternalServerErrorException({message: "Error verifying token"});
  }
}

export default verifyToken;