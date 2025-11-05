import { ChangeEvent, FormEvent } from 'react';
import { Box, Modal, Typography } from '@mui/material';

import { BaseTextInput } from '../BaseInput/BaseTextInput';

import { MainButton } from '@/components/Button/Button';

import styles from './confirmModal.module.scss';
import { PhoneInput } from '../Auth';
import { SubmitButton } from '../SubmitButton/SubmitButton';

interface Props {
  open: boolean;
  handleClose: () => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  type: 'appointmentCreate' | 'appointmentDelete';
  userData: {
    fName?: string;
    phone?: {
      dialCode: string;
      number: string;
    };
    country?: string;
  };
  appointmentData: {
    fName?: string;
    phone?: {
      dialCode: string;
      number: string;
    };
  };

  handleChangeUserAppointmentData?: (e: ChangeEvent<HTMLInputElement>) => void;
  isFNameExists?: boolean;
}

export function ConfirmModal({
  open,
  handleClose,
  handleSubmit,
  type,
  userData,
  appointmentData,
  handleChangeUserAppointmentData,
  isFNameExists,
  //   country,
}: Props) {
  const title =
    type === 'appointmentCreate'
      ? 'Confirm Services?'
      : 'Are you sure you want to leave the queue?';

  return (
    <Modal open={open} onClose={handleClose} className={styles.modal}>
      <Box
        className={styles.container}
        component="form"
        onSubmit={handleSubmit}
        noValidate
      >
        <Typography className={styles.title}>{title}</Typography>
        {type === 'appointmentCreate' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <BaseTextInput
              label="First Name"
              type="text"
              disabled={isFNameExists}
              value={appointmentData.fName || userData?.fName}
              inputProps={{
                name: 'fName',
                placeholder: 'First Name',
                minLength: 3,
                required: true,
                onChange: handleChangeUserAppointmentData,
                id: 'fName',
              }}
            />
            <PhoneInput phone={userData?.phone} country={userData.country} />
          </Box>
        )}

        <Box className={styles.actions}>
          <MainButton
            title="No"
            buttonProps={{ variant: 'outlined', onClick: handleClose }}
          />
          <SubmitButton title="Yes" />
        </Box>
      </Box>
    </Modal>
  );
}
