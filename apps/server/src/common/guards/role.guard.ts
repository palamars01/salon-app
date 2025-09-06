import { Request } from 'express';

import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { User } from '@/mongo/schemas/User/user.schema';

import { RolesEnum } from '@repo/shared/enums';

import { throwHttpException, withMetadata } from './utils';
import { BaseErrors } from '../constants';
import { ROLE_DECORATOR_KEY } from '../decorators/role.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const body = req.body;

    const getMetadata = withMetadata(this.reflector, context);

    const routeRoles = getMetadata<RolesEnum[]>(ROLE_DECORATOR_KEY)!;

    if (!routeRoles) return true;
    else {
      try {
        const user: User = req['user'];
        /* User set role with Google OAuth */
        if (body.role && !user.role) return true;

        /* Regular role check */
        if (!user.role || !routeRoles.includes(user.role)) throw new Error();
        return true;
      } catch {
        return throwHttpException(
          [BaseErrors.UNAUTHORIZED],
          HttpStatus.FORBIDDEN,
        );
      }
    }
  }
}
