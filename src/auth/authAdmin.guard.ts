import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
// import verifyToken from '../middleware/verifyToken';
import verifyAdmin from '../middleware/verifyAdmin';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthAdminGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    const gCtx = ctx.getContext();
    try {
      await verifyAdmin(request, gCtx.res);
      return true;
    } catch (error) {
      throw error;
    }
  }
}
