import jwt from 'jsonwebtoken';
import { Response } from 'express';
import {
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { RequestWithUser } from './expressRequest.interface';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const verifyToken = async (req: RequestWithUser, res: Response) => {
  try {
    const token = req.cookies.token
    // if (!token) {
    //   token = req.headers.authorization?.split(' ')[1];
    // }
    if (!token) {
      res.status(404).json({message: "Invalid token"})
      throw new UnauthorizedException({ message: 'Invalid token' });
    }
    const jwtSecretKey = configService.getOrThrow<string>('JWT_SECRET_KEY');
    if (!jwtSecretKey) {
      res.status(500).json({message: "JWT_SECRET_KEY is not defined"})
      throw new Error('JWT_SECRET_KEY is not defined');
    }
    const decoded = jwt.verify(token, jwtSecretKey);
    if (!decoded) {
      res.status(404).json({message: "Invalid token or not valid"})
      throw new UnauthorizedException({
        message: 'Invalid token or not valid',
      });
    }
    req.userId = decoded.userId;
    req.role = decoded.role;
  } catch (error) {
    if (!(error instanceof InternalServerErrorException)) {
      throw error;
    }
    throw new InternalServerErrorException({
      message: 'Error verifying token'
    })
  }
};

export default verifyToken;
