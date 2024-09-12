import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import verifyToken from '../middleware/verifyToken';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
      await verifyToken(request, context.switchToHttp().getResponse());
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}