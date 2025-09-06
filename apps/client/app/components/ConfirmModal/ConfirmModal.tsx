import { ChangeEvent } from 'react';
import { Box, Modal, Typography } from '@mui/material';

import { BaseTextInput } from '../BaseInput/BaseTextInput';

import { MainButton } from '@/components/Button/Button';

import styles from './confirmModal.module.scss';

interface Props {
  open: boolean;
  handleClose: () => void;
  handleSubmit: () => Promise<void>;
  type: 'appointmentCreate' | 'appointmentDelete';
  userAppointmentData?: {
    fName?: string;
    phone?: string;
  };
  handleChangeUserAppointmentData?: (e: ChangeEvent<HTMLInputElement>) => void;
  isFNameExists?: boolean;
}

export function ConfirmModal({
  open,
  handleClose,
  handleSubmit,
  type,
  userAppointmentData,
  handleChangeUserAppointmentData,
  isFNameExists,
}: Props) {
  const title =
    type === 'appointmentCreate'
      ? 'Confirm Services?'
      : 'Are you sure you want to leave the queue?';
  return (
    <Modal open={open} onClose={handleClose} className={styles.modal}>
      <Box className={styles.container} component="form" noValidate>
        <Typography className={styles.title}>{title}</Typography>
        {type === 'appointmentCreate' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <BaseTextInput
              label="First Name"
              type="text"
              disabled={isFNameExists}
              value={userAppointmentData?.fName}
              inputProps={{
                name: 'fName',
                placeholder: 'First Name',
                minLength: 3,
                required: true,
                onChange: handleChangeUserAppointmentData,
                id: 'fName',
              }}
            />
            <BaseTextInput
              label="Phone Number"
              type="text"
              value={userAppointmentData?.phone}
              inputProps={{
                name: 'phone',
                placeholder: 'Phone',
                pattern: '[0-9]',
                minLength: 9,
                required: true,
                onChange: handleChangeUserAppointmentData,
                id: 'phone',
              }}
            />
          </Box>
        )}

        <Box className={styles.actions}>
          <MainButton
            title="No"
            buttonProps={{ variant: 'outlined', onClick: handleClose }}
          />
          <MainButton title="Yes" buttonProps={{ onClick: handleSubmit }} />
        </Box>
      </Box>
    </Modal>
  );
}
