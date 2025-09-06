import { ModalWrapper } from '@/components/ModalWrapper/ModalWrapper';
import { Box, Typography } from '@mui/material';
import { CardButtons } from '@/components/CardButtons/CardButtons';

import { HANDLERS_ID } from '@/lib/types/types';

import styles from './setWaitTimeModal.module.scss';

export function SetWaitTimeModal() {
  return (
    <ModalWrapper>
      <Box className={styles.container}>
        <Typography className={styles.title}>Set wait time</Typography>
        <Box className={styles.wrapper}>
          <Box className={styles.time}>
            <input
              type="number"
              defaultValue={0}
              pattern="^\d{1}$"
              min={0}
              max={9}
              className={styles.first}
            />
            <input
              type="number"
              defaultValue={0}
              min={0}
              max={9}
              className={styles.second}
            />
          </Box>
          <Box className={styles.dots}>
            <span></span>
            <span></span>
          </Box>
          <Box className={styles.minutes}>
            <input
              type="number"
              defaultValue={0}
              min={0}
              max={9}
              className={styles.first}
            />
            <input
              type="number"
              defaultValue={0}
              min={0}
              max={9}
              className={styles.second}
            />
          </Box>
        </Box>
        <CardButtons
          cssWrraper={styles.buttons}
          lButton={{
            title: 'Cancel',
            color: '#4B9443',
            handler: {
              id: HANDLERS_ID.CLOSE_SLOT_MODAL,
            },
          }}
          rButton={{
            title: 'Update',
            bgColor: '#4B9443',
            textColor: '#ffffff',
          }}
        />
      </Box>
    </ModalWrapper>
  );
}
