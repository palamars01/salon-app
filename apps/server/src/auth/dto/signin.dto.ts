import { Signin } from '@repo/shared/interfaces/auth';
import { IsNotEmpty } from 'class-validator';

export class SigninDTO implements Signin {
  @IsNotEmpty({ message: 'Email or phone should not be empty' })
  authValue: string;

  authProvider: string;

  @IsNotEmpty({ message: 'Password should not be empty' })
  password?: string;
}
