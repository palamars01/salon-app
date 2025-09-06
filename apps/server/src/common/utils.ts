import dayjs from 'dayjs';

import { Appointment } from '@/mongo/schemas/Appointment/appointment.schema';
import {
  Appointment as AppointmentInterface,
  DashboardAppointment,
} from '@repo/shared/interfaces/appointment';
import {
  AppointmentStatusEnum,
  NotificationStatusEnum,
} from '@repo/shared/enums';
import { Notification } from '@repo/shared/interfaces/notification';

export const filterActiveAppointments = (value: Appointment) =>
  [AppointmentStatusEnum.pending, AppointmentStatusEnum.approved].includes(
    value.status,
  ) && dayjs(value.endTime).utc().isAfter(dayjs().utc());

export const normalizeAppointment = ({
  id,
  customer,
  salon,
  arrivalTime,
  services,
  phone,
  status,
  queuePosition,
}: AppointmentInterface): DashboardAppointment => {
  const waitTimeInMinutes = dayjs(arrivalTime).diff(dayjs(), 'minute');

  const dashboardAppointment: DashboardAppointment = {
    id,
    customer: {
      id: customer.id,
      fName: customer.fName!,
      phone: '+' + phone!,
    },
    salon: {
      id: salon.id,
      name: salon.name,
      address: salon.address,
    },
    status,
    services: services.map((s) => s.name),
    waitTimeInMinutes: waitTimeInMinutes > 0 ? waitTimeInMinutes : 0,
    arrivalTime: dayjs(arrivalTime).format('MM-DD-YY HH:mm A'),
    queuePosition,
  };

  return dashboardAppointment;
};

export const filterNotificationsByStatus = (
  notifications: Notification[],
  status: NotificationStatusEnum,
) => notifications.filter((n) => n.status === status);
