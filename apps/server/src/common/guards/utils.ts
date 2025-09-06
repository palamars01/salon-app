import { ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const throwHttpException = (errors: string[], status: HttpStatus) => {
  throw new HttpException(
    {
      errors,
      timestamp: new Date(Date.now()).toISOString(),
    },
    status,
  );
};

export const withMetadata =
  (reflector: Reflector, context: ExecutionContext) =>
  <T>(key: string) => {
    return reflector.getAllAndOverride<T>(key, [
      context.getHandler(),
      context.getClass(),
    ]);
  };
