import { NotificationsType, RolesEnum } from "../../enums/index.js";

export interface JwtPayload {
  id: string;
  notificationsSettings: {
    sms: boolean;
    push: boolean;
    preferred: NotificationsType | null;
  };
  role?: RolesEnum;
  tempPassword?: boolean;
  privateWorkerId?: string;
  fName?: string;
  lName?: string;
  phone?: string;
}

export type JwtTokens = {
  accessToken: string;
  refreshToken: string;
};
