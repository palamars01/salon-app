'use client';

import { useState } from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Box } from '@mui/material';
import { toast } from 'react-toastify';

import { deleteAppointment } from '@/lib/actions/appointment';
import { APP_ROUTES } from '@/lib/types/types';

import { MainButton } from '@/components/Button/Button';
import { ConfirmModal } from '@/components/ConfirmModal/ConfirmModal';

import styles from './actions.module.scss';

interface Props {
  appointmentId: string;
}

export function Actions({ appointmentId }: Props) {
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  const handleOpenConfirmModal = () => setOpenConfirmModal(true);

  const handleDeleteAppointment = async () => {
    const { data, errors } = await deleteAppointment(appointmentId);

    if (data.message) {
      toast.success('Appointment deleted successfuly');
      setOpenConfirmModal(false);
      redirect(APP_ROUTES.CUSTOMER.DASHBOARD);
    } else {
      errors?.forEach((e) => toast.error(e));
    }
  };
  return (
    <Box className={styles.actions}>
      <ConfirmModal
        type="appointmentDelete"
        open={openConfirmModal}
        handleSubmit={handleDeleteAppointment}
        handleClose={() => setOpenConfirmModal(false)}
      />
      <MainButton
        title="Leave Queue"
        cssClassName={styles.leave}
        buttonProps={{ onClick: handleOpenConfirmModal }}
      />
      <MainButton
        title="Notification Settings"
        cssClassName={styles.settings}
        buttonProps={{
          variant: 'outlined',
          component: Link,
          href: APP_ROUTES.CUSTOMER.NOTIFICATIONS.SETTINGS,
        }}
      />
    </Box>
  );
}
