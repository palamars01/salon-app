import { SetMetadata } from '@nestjs/common';
import { RolesEnum } from '@repo/shared/enums';

export const ROLE_DECORATOR_KEY = 'role';

export const Roles = (...roles: [RolesEnum, ...RolesEnum[]]) =>
  SetMetadata(ROLE_DECORATOR_KEY, roles);
