'use server';

/* Salon Services */

import { withFetch } from '@/lib/utils/utils';
import { ApiRoutes } from '@repo/shared/enums';
import { PublicSalon } from '@repo/shared/interfaces/salon';
import { PublicService, Service } from '@repo/shared/interfaces/salon/service';

export const getServices = async (salonId: string) => {
  const { data, errors } = await withFetch<
    null,
    { services: PublicService[]; notificationsCount: number | null }
  >({
    api: ApiRoutes.services.getAll.getOptions(salonId),
    authType: 'Bearer',
  });

  return { data, errors };
};
export const getServiceById = async (salonId: string, serviceId: string) => {
  const { data, errors } = await withFetch<
    null,
    { service: PublicService; notificationsCount: number | null }
  >({
    api: ApiRoutes.services.getOneById.getOptions(salonId, serviceId),
    authType: 'Bearer',
  });
  return { data, errors };
};

export const addSalonService = async (formData: FormData, salonId: string) => {
  const body = Object.fromEntries(formData) as unknown as Omit<Service, 'id'>;
  body.availability = formData.getAll('availability')! as string[];

  const { data, errors } = await withFetch<typeof body, { salon: PublicSalon }>(
    {
      api: ApiRoutes.services.create.getOptions(salonId),
      body,
      authType: 'Bearer',
      isClient: true,
    },
  );
  return { data, errors };
};

export const updateSalonService = async (
  formData: FormData,
  salonId: string,
  serviceId: string,
) => {
  const body = Object.fromEntries(formData) as unknown as Omit<Service, 'id'>;
  body.availability = formData.getAll('availability')! as string[];

  const { data, errors } = await withFetch<typeof body, { salon: PublicSalon }>(
    {
      api: ApiRoutes.services.update.getOptions(salonId, serviceId),
      body,
      authType: 'Bearer',
      isClient: true,
    },
  );
  return { data, errors };
};

export const deleteService = async (salonId: string, serviceId: string) => {
  const { data, errors } = await withFetch<null, { services: PublicService[] }>(
    {
      api: ApiRoutes.services.delete.getOptions(salonId, serviceId),
      authType: 'Bearer',
      isClient: true,
    },
  );
  return { data, errors };
};
