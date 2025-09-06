'use server';

import { revalidatePath } from 'next/cache';

import { APP_ROUTES } from '@/lib/types/types';
import { withFetch } from '@/lib/utils/utils';

import { ApiRoutes } from '@repo/shared/enums';
import { PublicSalon } from '@repo/shared/interfaces/salon';
import { PrivateWorker } from '@repo/shared/interfaces/salon/privateWorker';
import { DashboardAppointment } from '@repo/shared/interfaces/appointment';

/* Salon private workers */
export const addPrivateWorker = async (formData: FormData, salonId: string) => {
  const body = Object.fromEntries(formData) as unknown as PrivateWorker;

  const { data, errors } = await withFetch<typeof body, { salon: PublicSalon }>(
    {
      api: ApiRoutes.privateWorkers.create.getOptions(salonId),
      body,
      authType: 'Bearer',
      isClient: true,
    },
  );

  return { data, errors };
};

export const getPrivateWorkers = async (salonId: string) => {
  const { data, errors } = await withFetch<
    null,
    { privateWorkers: PrivateWorker[]; id: string }
  >({
    api: ApiRoutes.privateWorkers.getAll.getOptions(salonId),
    authType: 'Bearer',
  });
  return { data, errors };
};

export const deletePrivateWorker = async (
  salonId: string,
  privateWorkerId: string,
) => {
  const { data, errors } = await withFetch<
    null,
    { privateWorkers: PrivateWorker[] }
  >({
    api: ApiRoutes.privateWorkers.delete.getOptions(salonId, privateWorkerId),
    authType: 'Bearer',
  });
  if (data) {
    revalidatePath(APP_ROUTES.PRIVATE_WORKERS.MAIN(salonId));
  }

  return { data, errors };
};

export const getPrivateWorkerDasdboard = async (privateWorkerId: string) => {
  const { data, errors } = await withFetch<
    null,
    {
      salon: PublicSalon;
      widgetsData: { customersWaiting: number; totalCustomers: number };
      firstApprovedAppointment: DashboardAppointment;
      firstUpcomingAppointment: DashboardAppointment;
    }
  >({
    api: ApiRoutes.privateWorkers.getDashboardData.getOptions(privateWorkerId),
    authType: 'Bearer',
  });

  return { data, errors };
};
