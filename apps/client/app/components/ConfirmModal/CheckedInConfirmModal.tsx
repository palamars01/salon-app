import { Box, Modal, Typography } from '@mui/material';

import { MainButton } from '@/components/Button/Button';

import styles from './confirmModal.module.scss';

interface Props {
  open: boolean;
  customerName: string;
  handleClose: () => void;
  handleConfirmSubmit: () => Promise<void>;
}

export function CheckedInConfirmModal({
  open,
  customerName,
  handleClose,
  handleConfirmSubmit,
}: Props) {
  return (
    <Modal open={open} onClose={handleClose} className={styles.modal}>
      <Box className={styles.container}>
        <Typography className={styles.title}>
          Confirm Customer Check-In
        </Typography>
        <Typography className={styles.content}>
          Are you sure you want to mark {customerName} as checked in? This
          action will update their status and notify the next customer in line.
        </Typography>
        <Box className={styles.actions}>
          <MainButton
            title="Cancel"
            buttonProps={{ onClick: handleClose, variant: 'outlined' }}
          />
          <MainButton
            title="Confirm"
            buttonProps={{ onClick: handleConfirmSubmit }}
          />
        </Box>
      </Box>
    </Modal>
  );
}
