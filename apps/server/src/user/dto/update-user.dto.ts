import { IsEnum, IsNotEmpty, MinLength, ValidateIf } from 'class-validator';

import { RolesEnum } from '@repo/shared/enums';

import { User } from '@/mongo/schemas/User/user.schema';

export class UpdateUserDTO implements Partial<User> {
  @ValidateIf((o) => Object.keys(o).includes('role'))
  @IsEnum([RolesEnum.customer, RolesEnum.salon], {
    message: 'User type is not permited',
  })
  role?: RolesEnum | undefined;

  @ValidateIf((o) => Object.keys(o).includes('password'))
  @IsNotEmpty({
    message: "Password couldn't be empty",
  })
  @MinLength(8, {
    message: 'Password should be at least 8 characters',
  })
  password?: string;
}
