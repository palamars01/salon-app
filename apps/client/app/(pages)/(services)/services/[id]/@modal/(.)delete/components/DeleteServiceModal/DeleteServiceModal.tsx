'use server';

import { Box, Typography } from '@mui/material';

import { CardButtons } from '@/components/CardButtons/CardButtons';
import { ModalWrapper } from '@/components/ModalWrapper/ModalWrapper';

import { HANDLERS_ID } from '@/lib/types/types';

import styles from './deleteServiceModal.module.scss';

interface Props {
  serviceName: string;
  salonId: string;
  serviceId: string;
}
export async function DeleteServiceModal({
  serviceName,
  salonId,
  serviceId,
}: Props) {
  return (
    <ModalWrapper>
      <Box className={styles.wrapper}>
        <Typography className={styles.title}>Delete This Service?</Typography>
        <Box className={styles.description}>
          <Typography>
            Are you sure you want to delete {serviceName}?
          </Typography>
          <Typography>
            This action is permanent, and you won’t be able to recover it.
          </Typography>
        </Box>

        <CardButtons
          cssWrraper={styles.actionsWrraper}
          lButton={{
            title: 'Cancel',
            color: '#4B9443',
            handler: {
              id: HANDLERS_ID.CLOSE_SLOT_MODAL,
            },
          }}
          rButton={{
            title: 'Delete Service',
            bgColor: '#4B9443',
            textColor: '#ffffff',
            props: { className: styles.delete },
            handler: {
              id: HANDLERS_ID.DELETE_SERVICE,
              props: { salonId, serviceId },
            },
          }}
        />
      </Box>
    </ModalWrapper>
  );
}
