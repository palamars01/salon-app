import { NotificationStatusEnum, RolesEnum } from '@repo/shared/enums';
import { Appointment } from '@repo/shared/interfaces/appointment';
import { NotificationsType } from '@repo/shared/interfaces/notification';
import dayjs from 'dayjs';

export const BaseNotifications = (
  appointment: Appointment,
  type: NotificationsType,
  role: RolesEnum,
): { title: string; description: string; status: NotificationStatusEnum } => {
  const waitTimeInMinutes = dayjs(appointment.arrivalTime)
    .utc()
    .diff(dayjs().utc(), 'minute');
  if (type === NotificationsType.APPOINTMENT_CREATED) {
    if (role === RolesEnum.customer) {
      return {
        title: "You're in the Queue!",
        description: `Your position is ${appointment.queuePosition}. Estimated wait time: ${waitTimeInMinutes > -1 ? waitTimeInMinutes : 0} mins.`,
        status: NotificationStatusEnum.unread,
      };
    } else if (role === RolesEnum.salon) {
      return {
        title: 'New appointment',
        description: `${appointment.salon.name}${appointment.privateWorkerId ? ' (personal) ' : ''} got new appointment.`,
        status: NotificationStatusEnum.unread,
      };
    }
  } else if (type === NotificationsType.FIRST_IN_QUEUE) {
    return {
      title: "It's Almost Your Turn!",
      description: `You're next! Please head to ${appointment.salon.name} to check 
in.`,
      status: NotificationStatusEnum.unread,
    };
  } else if (type === NotificationsType.QUEUE_UPDATED) {
    return {
      title: 'Queue Update',
      description: `Your position has been updated to ${appointment.queuePosition}. Estimated wait time: ${waitTimeInMinutes > -1 ? waitTimeInMinutes : 0} mins.`,
      status: NotificationStatusEnum.unread,
    };
  }

  return {
    title: '',
    description: '',
    status: NotificationStatusEnum.unread,
  };
};

export const getBaseNotification = (
  appointment: Appointment,
  type: NotificationsType,
  role: RolesEnum,
) => {
  return BaseNotifications(appointment, type, role);
};
