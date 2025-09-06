import {
  IsEmail,
  IsNotEmpty,
  IsMobilePhone,
  IsEnum,
  MinLength,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

import { Signup, SignupRole } from '@repo/shared/interfaces/auth';
import { AuthProvidersEnum, RolesEnum } from '@repo/shared/enums';

export class SignupDTO implements Signup {
  @IsNotEmpty({
    groups: [AuthProvidersEnum.EMAIL, AuthProvidersEnum.PHONE],
    message: "Password couldn't be empty",
  })
  @MinLength(8, {
    groups: [AuthProvidersEnum.EMAIL, AuthProvidersEnum.PHONE],
    message: 'Password should be at least 8 characters',
  })
  password?: string;

  @IsEnum([RolesEnum.customer, RolesEnum.salon], {
    groups: [AuthProvidersEnum.EMAIL, AuthProvidersEnum.PHONE],
    message: 'User type is not permited',
  })
  role?: SignupRole;

  @IsNotEmpty()
  @IsEnum(AuthProvidersEnum, { message: 'Not valid provider' })
  authProvider: AuthProvidersEnum;

  @IsOptional()
  @IsEmail(
    {},
    { groups: [AuthProvidersEnum.EMAIL], message: 'Email is not valid' },
  )
  @IsMobilePhone(
    undefined,
    {},
    {
      groups: [AuthProvidersEnum.PHONE],
      message: 'Phone number format is not valid',
    },
  )
  authValue: string;

  @ValidateIf((o) => Object.keys(o).includes('fName'))
  @IsString()
  fName?: string | undefined;

  @ValidateIf((o) => Object.keys(o).includes('lName'))
  @IsOptional()
  @IsString()
  lName?: string | undefined;
}
