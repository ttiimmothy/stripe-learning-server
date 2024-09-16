import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import verifyToken from '../middleware/verifyToken';
// import verifyAdmin from '../middleware/verifyAdmin';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    const gCtx = ctx.getContext();
    // const request = context.switchToHttp().getRequest();
    // console.log(request.headers)
    // const token = request.headers.authorization?.split(' ')[1];
    // console.log(token)
    try {
      // await verifyToken(request, context.switchToHttp().getResponse().res);
      await verifyToken(request, gCtx.res);
      return true;
    } catch (error) {
      throw error;
    }
  }
}
