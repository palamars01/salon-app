'use server';

import { withFetch } from '@/lib/utils/utils';

import { ApiRoutes } from '@repo/shared/enums';
import { Notification } from '@repo/shared/interfaces/notification';

export const getAll = async () => {
  const { data, errors } = await withFetch<
    null,
    { notifications: Notification[] }
  >({
    api: ApiRoutes.notifications.getAll.getOptions(),
    authType: 'Bearer',
  });
  return { data, errors };
};

export const updateNotification = async (
  body: Partial<Notification>,
  notificationId: string,
) => {
  const { data, errors } = await withFetch<
    typeof body,
    { notification: Notification }
  >({
    api: ApiRoutes.notifications.update.getOptions(notificationId),
    body,
    authType: 'Bearer',
  });

  return { data, errors };
};

export const getUnread = async () => {
  const { data, errors } = await withFetch<
    null,
    { initialNotificationsCount: number }
  >({
    api: ApiRoutes.notifications.getAllUnreadCount.getOptions(),
    authType: 'Bearer',
  });
  return { data, errors };
};
