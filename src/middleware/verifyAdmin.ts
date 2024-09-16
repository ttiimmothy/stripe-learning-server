import { UnauthorizedException } from '@nestjs/common';
import { RequestWithUser } from './expressRequest.interface';
import { Response } from 'express';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const verifyAdmin = (req: RequestWithUser, res: Response) => {
  try {
    if (req.role !== 'admin') {
      throw new UnauthorizedException({
        message: 'You are not authorized to perform this action',
      });
    }
  } catch (error) {
    throw error;
  }
};

export default verifyAdmin;
