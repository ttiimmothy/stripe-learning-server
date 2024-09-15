import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import {InternalServerErrorException, UnauthorizedException} from "@nestjs/common";
import {RequestWithUser} from "./expressRequest.interface";

interface JwtPayload {
  userId: string;
  role: string;
}

const verifyToken = async(req: RequestWithUser, res: Response) => {
  try {
    let token = req.cookies.token;
    if (!token) {
      token = req.headers.authorization?.split(' ')[1];
    }
    if (!token) {
      throw new UnauthorizedException({message: "Invalid token"});
    }
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    if (!jwtSecretKey) {
      throw new Error("JWT_SECRET_KEY is not defined");
    }
   
    const decoded = jwt.verify(token, jwtSecretKey);
    if (!decoded) {
      throw new UnauthorizedException({message: "Invalid token or not valid"});
    }
    req.userId = decoded.userId;
    req.role = decoded.role;
    // return true;
  } catch (error) {
    if (!(error instanceof InternalServerErrorException)) {
      throw error;
    }
    throw new InternalServerErrorException({message: "Error verifying token"});
  }
}

export default verifyToken;