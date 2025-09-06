import { Request } from 'express';

import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

import { AuthProvidersEnum } from '@repo/shared/enums';

import { throwHttpException } from './utils';
import { BaseErrors } from '../constants';

@Injectable()
export class RejectDirectGoogleAuth implements CanActivate {
  constructor() {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();

    try {
      const { authProvider } = req.body;
      if (authProvider === AuthProvidersEnum.GOOGLE) throw new Error();

      return true;
    } catch {
      return throwHttpException(
        [BaseErrors.UNAUTHORIZED],
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
