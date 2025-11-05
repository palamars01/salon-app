import {
  AuthProvidersEnum,
  NotificationsType,
  RolesEnum,
} from "../../enums/index.js";

export interface PhoneNumber {
  dialCode: string;
  number: string;
}

export interface User {
  authProvider: AuthProvidersEnum;

  authValue: string;

  password?: string;

  tempPassword?: string;

  role?: RolesEnum;

  fName?: string;

  lName?: string;

  phone?: PhoneNumber;

  privateWorkerId?: string;

  country?: string;

  notificationsSettings: {
    sms: boolean;
    push: boolean;
    preferred: NotificationsType | null;
  };
}

export interface UserSchema extends User {
  isPasswordMatch: (password: string) => boolean;
  toPublic: () => PublicUser;
}

export interface PublicUser extends Omit<User, "password" | "tempPassword"> {
  id: string;
  tempPassword?: boolean;
  privateWorkerId?: string;
}
