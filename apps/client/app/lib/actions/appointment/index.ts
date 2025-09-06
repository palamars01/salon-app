'use server';

import { createSession, getSession } from '@/lib/session/session';
import { APP_ROUTES } from '@/lib/types/types';
import { withFetch } from '@/lib/utils/utils';
import { ApiRoutes, AppointmentStatusEnum } from '@repo/shared/enums';
import {
  Appointment,
  CreateAppointmentResponse,
  AppointmentStatus,
  DashboardAppointment,
} from '@repo/shared/interfaces/appointment';
import { revalidatePath } from 'next/cache';

export const createAppointment = async (
  body: Pick<
    Appointment,
    'services' | ('privateWorkerId' & { salon: string })
  > & {
    phone?: string;
    fName?: string;
  },
) => {
  const { data, errors } = await withFetch<
    typeof body,
    { appointment: CreateAppointmentResponse }
  >({
    api: ApiRoutes.appointments.create,
    body,
    authType: 'Bearer',
    isClient: true,
  });
  if (data?.appointment.id) {
    const payload = await getSession();
    if (payload) {
      await createSession({
        user: Object.assign(payload.user, {
          phone: body.phone,
          fName: body.fName || payload.user.fName,
        }),
        jwtTokens: payload?.jwtTokens,
      });
    }
  }
  revalidatePath(APP_ROUTES.CUSTOMER.SALONS);
  return { data, errors };
};

export const getStatusData = async (appointmentId: string) => {
  const { data, errors } = await withFetch<
    null,
    { appointment: AppointmentStatus; initialNotificationsCount: number }
  >({
    api: ApiRoutes.appointments.getStatusData.getOptions(appointmentId),
    authType: 'Bearer',
  });
  return { data, errors };
};

export const deleteAppointment = async (appointmentId: string) => {
  const { data, errors } = await withFetch<null, { message: 'success' }>({
    api: ApiRoutes.appointments.delete.getOptions(appointmentId),
    authType: 'Bearer',
    isClient: true,
  });
  return { data, errors };
};

export const updateAppointment = async (
  body: Partial<Appointment>,
  appointmentId: string,
  pathToRevalidate: string,
) => {
  const { data, errors } = await withFetch<
    typeof body,
    { appointment: Appointment }
  >({
    api: ApiRoutes.appointments.update.getOptions(appointmentId),
    body,
    authType: 'Bearer',
  });

  revalidatePath(pathToRevalidate);

  return { data, errors };
};
export const bulkCheckIn = async (body: string[]) => {
  const { data, errors } = await withFetch<
    typeof body,
    { modifiedCount: number }
  >({
    api: ApiRoutes.appointments.bulkCheckIn.getOptions,
    body,
    authType: 'Bearer',
  });

  return { data, errors };
};

export const getAppointmentsByStatus = async (
  status: AppointmentStatusEnum,
  salonId: string,
) => {
  const options = ApiRoutes.appointments.getAppointmentsByStatus.getOptions;
  const { data, errors } = await withFetch<
    typeof options.body,
    {
      appointments?: { salonName: string; list: DashboardAppointment[] };
      groupedAppointments?: {
        salon: { id: string; name: string };
        appointment: DashboardAppointment;
      }[];
    }
  >({
    api: options,
    body: { status, salonId },
    authType: 'Bearer',
  });
  return { data, errors };
};
