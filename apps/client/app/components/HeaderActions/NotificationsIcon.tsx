'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconButton, Typography } from '@mui/material';

import { BellIcon } from '../Icons/BellIcon';

import { useWebSocket } from '@/lib/utils/socket';

import styles from './headerActions.module.scss';

interface Props {
  notificationsPath?: string;
  color?: string;
}

export function NotificationsIcon({ notificationsPath, color }: Props) {
  const context = useWebSocket();

  const pathname = usePathname();

  const isDashboard = pathname.includes('dashboard');
  const isNotificationsPage = pathname.includes('notifications');

  if (isNotificationsPage) return null;

  return (
    <IconButton
      LinkComponent={Link}
      href={notificationsPath!}
      className={styles.icon}
    >
      {!!context?.notificationsCount && (
        <Typography
          className={styles.count}
          sx={{ color: color || isDashboard ? '#F8F2EC' : '#325928' }}
        >
          {context?.notificationsCount}
        </Typography>
      )}
      <BellIcon color={color || isDashboard ? '#F8F2EC' : '#325928'} />
    </IconButton>
  );
}
