import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import verifyAdmin from '../middleware/verifyAdmin';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthAdminGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const gCtx = ctx.getContext();
    const request = gCtx.req;
    const response = gCtx.res
    try {
      await verifyAdmin(request, response);
      return true;
    } catch (error) {
      throw error;
    }
  }
}
