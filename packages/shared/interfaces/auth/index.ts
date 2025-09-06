import { AuthProvidersEnum, RolesEnum } from "../../enums/index.js";

export type SignupRole =
  | RolesEnum.customer
  | RolesEnum.salon
  | RolesEnum.privateWorker;

export interface Signup {
  authProvider: AuthProvidersEnum;
  authValue: string;
  password?: string;
  role?: SignupRole;
  fName?: string;
  lName?: string;
}

export type Signin = Pick<Signup, "authValue" | "password">;

export interface GoogleUser {
  email: string;
  refreshToken: string;
  accessToken: string;
  fName?: string | null;
  lName?: string | null;
}
