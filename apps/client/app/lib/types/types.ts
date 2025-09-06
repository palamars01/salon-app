import { JwtTokens, JwtPayload } from '@repo/shared/interfaces/jwt';

export type Session = {
  user: JwtPayload;
  jwtTokens: JwtTokens;
};

export const APP_ROUTES = {
  AUTH: {
    MAIN: '/auth',
    SIGNIN: '/auth/signin',
    SIGNUP: '/auth/signup',
    LOGOUT: '/api/auth/logout',
  } as const,
  ROUTER: '/router' as const,
  SALON: {
    MAIN: '/salon' as const,
    DASHBOARD: (salonId: string) => `/salon/${salonId}/dashboard/` as const,
    CREATE: '/salon/create' as const,
    SELECT_SERVICE_MODEL: (salonId: string) =>
      `/salon/${salonId}/select-service-model` as const,
    NOTIFICATIONS: {
      LIST: (salonId: string) => `/salon/${salonId}/notifications` as const,
    } as const,

    SETTINGS: {
      MAIN: (salonId: string) => `/salon/${salonId}/settings` as const,
      HOW_TO: (salonId: string) => `/salon/${salonId}/settings/how-to` as const,
    } as const,
  },
  SERVICES: {
    MAIN: (salonId: string) => `/services/${salonId}` as const,
    ADD: (salonId: string) => `/services/${salonId}/add` as const,
    EDIT: (salonId: string, serviceId: string) =>
      `/services/${salonId}/edit/${serviceId}` as const,
    DELETE: (salonId: string, serviceId: string) =>
      `/services/${salonId}/delete/${serviceId}` as const,
  } as const,
  PRIVATE_WORKERS: {
    MAIN: (salonId: string) => `/private-workers/${salonId}/` as const,
    ADD: (salonId: string) => `/private-workers/${salonId}/add` as const,
    DASHBOARD: (privateworkerId: string) =>
      `/private-workers/${privateworkerId}/dashboard`,
  } as const,
  CUSTOMER: {
    MAIN: '/customer',
    DASHBOARD: '/customer/dashboard',
    SALONS: '/customer/salons',
    NOTIFICATIONS: {
      SETTINGS: '/customer/notifications/settings' as const,
      LIST: '/customer/notifications' as const,
    } as const,
  } as const,
  APPOINTMENTS: {
    STATUS: (appointmentId: string) => `/appointments/${appointmentId}/status`,
    QUEUE: (apointmentStatus: string) =>
      `/appointments/queue/${apointmentStatus}`,
  } as const,
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    SALONS: '/admin/salons',
    NOTIFICATIONS: {
      LIST: `/admin/notifications` as const,
    } as const,
  } as const,
  NOTIFICATIONS: {
    LIST: '/notifications' as const,
  } as const,
} as const;

export interface Response<T> {
  data: T;
  statusCode: number;
  timestamp: string;
  message?: 'OK';
  errors?: string[];
}

export enum HANDLERS_ID {
  CLOSE_SLOT_MODAL = 'handleCloseSlotModal',
  DELETE_SERVICE = 'handleDeleteService',
}
