import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import verifyToken from '../middleware/verifyToken';
// import verifyAdmin from '../middleware/verifyAdmin';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const gCtx = ctx.getContext();
    const request = gCtx.req;
    const response = gCtx.res;
    // for express context
    // const request = context.switchToHttp().getRequest();
    // const requst = context.switchToHttp().getResponse()
    // const token = request.headers.authorization?.split(' ')[1];
    try {
      await verifyToken(request, response);
      return true;
    } catch (error) {
      throw error;
    }
  }
}
