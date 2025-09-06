import Link from 'next/link';
import { Box, Modal, Typography } from '@mui/material';

import { MainButton } from '@/components/Button/Button';

import styles from './confirmModal.module.scss';

interface Props {
  open: boolean;
  customerName: string;
  handleClose: () => void;
  handleConfirmSubmit: () => Promise<void>;
}

export function MissedConfirmModal({
  open,
  customerName,
  handleClose,
  handleConfirmSubmit,
}: Props) {
  return (
    <Modal open={open} onClose={handleClose} className={styles.modal}>
      <Box className={styles.container}>
        <Typography className={styles.title}>Missed Customer Alert</Typography>
        <Typography className={styles.content}>
          Oops! {customerName} didn't check in on time. Would you like to mark
          them as missed, or should we reach out to them?
        </Typography>
        <Box className={styles.actions}>
          <MainButton
            title="Call User"
            buttonProps={{
              variant: 'outlined',
              component: Link,
              href: 'tel:555-555-5555',
            }}
          />
          <MainButton
            title="Mark Missed"
            buttonProps={{ onClick: handleConfirmSubmit }}
          />
        </Box>
      </Box>
    </Modal>
  );
}
