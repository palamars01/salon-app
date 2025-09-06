import { PublicSalon } from "@repo/shared/interfaces/salon";

export enum AuthProvidersEnum {
  EMAIL = "email",
  PHONE = "phone",
  GOOGLE = "google",
}

export enum RolesEnum {
  "salon" = "salon",
  customer = "customer",
  admin = "admin",
  privateWorker = "private-worker",
}

export enum AppointmentStatusEnum {
  pending = "pending",
  approved = "approved",
  declined = "declined",
  checkedIn = "checked-in",
  missed = "missed",
  completed = "completed",
}

export const ApiRoutes = {
  auth: {
    base: "auth",
    signin: { path: "/signin", route: "/auth/signin", method: "post" },
    signup: { path: "/signup", route: "/auth/signup", method: "post" },
    refreshToken: {
      path: "/refresh-token",
      route: "/auth/refresh-token",
      method: "get",
    },
    logout: { path: "/logout", route: "/auth/logout", method: "get" },
    google: { path: "/google", route: "/auth/google", method: "get" },
  },
  users: {
    base: "users",
    update: { route: "/users", method: "put" },
  },
  salons: {
    create: {
      path: "/",
      route: "/salons",
      method: "post",
    },
    getSalonDashboard: {
      path: "/:salonId",
      getOptions: (salonId: string) => ({
        route: `/salons/${salonId}`,
        method: "get",
      }),
    },
    getSalonsForCustomer: {
      path: "/customer/get-salons",
      getOptions: (searchParam?: string) => {
        let route = "/salons/customer/get-salons";

        if (searchParam) route += searchParam;

        return {
          route,
          method: "get",
        };
      },
    },
    getSalonsByAdminId: {
      path: "/admin/getAll",
      route: "/salons/admin/getAll",
      method: "get",
    },

    getAdminDashboard: {
      path: "/admin/dashboard",
      route: "/salons/admin/dashboard",
      method: "get",
    },

    update: {
      path: "/:salonId/update",
      getOptions: (salonId: string) => ({
        route: `/salons/${salonId}/update`,
        method: "put",
      }),
    },
  },
  services: {
    getAll: {
      path: "/getAll/:salonId",
      getOptions: (salonId: string) => {
        let route = salonId
          ? `/services/getAll/${salonId}`
          : "/services/getAll";

        return {
          route,
          method: "get",
        };
      },
    },
    getOneById: {
      path: "/:salonId/get/:serviceId",
      getOptions: (salonId: string, serviceId: string) => ({
        route: `/services/${salonId}/get/${serviceId}`,
        method: "get",
      }),
    },
    create: {
      path: "/:salonId/add",
      getOptions: (salonId: string) => ({
        route: `/services/${salonId}/add`,
        method: "post",
      }),
    },
    update: {
      path: "/:salonId/update/:serviceId",
      getOptions: (salonId: string, serviceId: string) => ({
        route: `/services/${salonId}/update/${serviceId}`,
        method: "put",
      }),
    },
    delete: {
      path: "/:salonId/delete/:serviceId",
      getOptions: (salonId: string, serviceId: string) =>
        ({
          route: `/services/${salonId}/delete/${serviceId}`,
          method: "delete",
        }) as const,
    },
  },
  privateWorkers: {
    create: {
      path: "/:salonId/add",
      getOptions: (salonId: string) => ({
        route: `/private-workers/${salonId}/add`,
        method: "post",
      }),
    },
    getAll: {
      path: "/:salonId/getAll",
      getOptions: (salonId: string) => ({
        route: `/private-workers/${salonId}/getAll`,
        method: "get",
      }),
    },
    delete: {
      path: "/:salonId/delete/:privateWorkerId",
      getOptions: (salonId: string, privateWorkerId: string) =>
        ({
          route: `/private-workers/${salonId}/delete/${privateWorkerId}`,
          method: "delete",
        }) as const,
    },
    getDashboardData: {
      path: "/get-dashboard/:privateWorkerId",
      getOptions: (privateWorkerId: string) => ({
        route: `/private-workers/get-dashboard/${privateWorkerId}`,
        method: "get",
      }),
    },
  },
  appointments: {
    base: "appointments",
    create: {
      path: "/",
      route: "/appointments",
      method: "post",
    } as const,
    getStatusData: {
      path: "/:appointmentId/status",
      getOptions: (appointmentId: string) => ({
        route: `/appointments/${appointmentId}/status`,
        method: "get",
      }),
    } as const,
    delete: {
      path: "/:appointmentId/delete",
      getOptions: (appointmentId: string) => ({
        route: `/appointments/${appointmentId}/delete`,
        method: "delete",
      }),
    } as const,
    update: {
      path: "/:appointmentId/update",
      getOptions: (appointmentId: string) => ({
        route: `/appointments/${appointmentId}/update`,
        method: "put",
      }),
    } as const,
    getAppointmentsByStatus: {
      path: "/get-list",
      getOptions: {
        route: `/appointments/get-list`,
        method: "post",
        body: {
          status: "" as AppointmentStatusEnum,
          salonId: "" as string,
        },
      },
    } as const,

    bulkCheckIn: {
      path: "/bulk-checkIn",
      getOptions: {
        route: "/appointments/bulk-checkIn",
        method: "post",
      },
    } as const,
  } as const,
  notifications: {
    base: "notifications",
    getAllUnreadCount: {
      path: "/getAllUnreadCount/:salonId?",
      getOptions: () => ({
        route: "/notifications/getAllUnreadCount",
        method: "get",
      }),
    } as const,
    getAll: {
      path: "/getAll",
      getOptions: () => ({
        route: "/notifications/getAll",
        method: "get",
      }),
    } as const,
    update: {
      path: "/:notificationId/update",
      getOptions: (notificationId: string) => ({
        route: `/notifications/${notificationId}/update`,
        method: "put",
      }),
    } as const,
  } as const,
} as const;

export enum NotificationsType {
  sms = "sms",
  push = "push",
}

export enum SocketEvents {
  ADD_USER = "add user",
  INITIAL_NOTIFICATIONS_COUNT = "initial notifications count",
  APPOINTMENT_CREATED = "appointment craeted",
  NOTIFICATION_READ = "notification read",
}

export enum NotificationStatusEnum {
  unread = "unread",
  read = "read",
}
