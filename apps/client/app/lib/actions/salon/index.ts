'use server';

import { ApiRoutes } from '@repo/shared/enums';

import {
  Salon,
  PublicSalon,
  CustomerDashboardSalon,
  AdminWidgets,
} from '@repo/shared/interfaces/salon';
import { DashboardAppointment } from '@repo/shared/interfaces/appointment';

import { withFetch } from '@/lib/utils/utils';

type CreateResponse = { salon: PublicSalon };

export const createSalon = async (
  formData: Iterable<[Salon, FormDataEntryValue]>,
) => {
  const userSalonData: Salon = Object.fromEntries(formData);

  const { data, errors } = await withFetch<Salon, CreateResponse>({
    api: ApiRoutes.salons.create,
    authType: 'Bearer',
    body: userSalonData,
    isClient: true,
  });

  return { data, errors };
};

export const getSalonsByAdminId = async () => {
  const { data, errors } = await withFetch<
    null,
    {
      salons: PublicSalon[];
      firstUpcomingAppointment: DashboardAppointment;
      notificationsCount: number | null;
    }
  >({
    api: ApiRoutes.salons.getSalonsByAdminId,
    authType: 'Bearer',
  });

  return { data, errors };
};

export const getAdminDashboard = async () => {
  const { data, errors } = await withFetch<
    null,
    {
      widgetsData: AdminWidgets;
      firstUpcomingAppointment: DashboardAppointment;
    }
  >({
    api: ApiRoutes.salons.getAdminDashboard,
    authType: 'Bearer',
  });

  return { data, errors };
};

export const getSalonDashboard = async (salonId: string) => {
  const { data, errors } = await withFetch<
    null,
    {
      salon: PublicSalon;
      firstApprovedAppointment: DashboardAppointment;
      firstUpcomingAppointment: null;
    }
  >({
    api: ApiRoutes.salons.getSalonDashboard.getOptions(salonId),
    authType: 'Bearer',
  });

  return { data, errors };
};

export const getSalonsForCustomer = async (
  searchParam?: string,
  isClient: boolean = false,
) => {
  const { data, errors } = await withFetch<
    null,
    {
      salons: CustomerDashboardSalon[];
    }
  >({
    api: ApiRoutes.salons.getSalonsForCustomer.getOptions(searchParam),
    authType: 'Bearer',
    isClient,
  });

  return { data, errors };
};

export const updateSalon = async (
  salonId: string,
  formData: FormData | Partial<Salon>,
) => {
  const userSalonData: Partial<Salon> =
    formData instanceof FormData ? Object.fromEntries(formData) : formData;

  const { data, errors } = await withFetch<
    Partial<Salon>,
    { updatedSalon: PublicSalon }
  >({
    api: ApiRoutes.salons.update.getOptions(salonId),
    authType: 'Bearer',
    body: userSalonData,
  });

  return { data, errors };
};
