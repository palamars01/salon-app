'use client';

import { Notification } from '@repo/shared/interfaces/notification';

import { Box, Typography } from '@mui/material';
import { NotificationStatusEnum } from '@repo/shared/enums';

import { updateNotification } from '@/lib/actions/notifications';
import { redirect } from 'next/navigation';

import styles from './notificationItem.module.scss';
import { APP_ROUTES } from '@/lib/types/types';

interface Props {
  notification: Notification;
}

export function NotificationItem({ notification }: Props) {
  const handleNotificationRead = async (notificationId: string) => {
    const { data } = await updateNotification(
      { status: NotificationStatusEnum.read },
      notificationId,
    );

    if (data.notification.id) {
      const redirectPath =
        notification.receiver === 'customer'
          ? APP_ROUTES.APPOINTMENTS.STATUS(notification.appointmentId!)
          : APP_ROUTES.SALON.DASHBOARD(notification.salon.id);

      redirect(redirectPath);
    }
  };
  return (
    <Box
      className={`${styles.container} ${styles[notification.status]}`}
      onClick={() => handleNotificationRead(notification.id)}
      sx={{
        cursor:
          notification.status === NotificationStatusEnum.unread
            ? 'pointer'
            : 'auto',
      }}
    >
      <Typography className={styles.title}>{notification.title}</Typography>
      <Typography className={styles.description}>
        {notification.description}
      </Typography>
      <Typography className={styles.timePassed}>
        {notification.timePassed}
      </Typography>
    </Box>
  );
}
