import { Signup, SignupRole } from '@repo/shared/interfaces/auth';
import { AuthProvidersEnum } from '@repo/shared/enums';

export class CreateUserDTO implements Signup {
  authProvider: AuthProvidersEnum;

  authValue: string;
  password?: string;
  tempPassword?: string;
  role?: SignupRole;
  fName?: string | undefined;
  lName?: string | undefined;
}
