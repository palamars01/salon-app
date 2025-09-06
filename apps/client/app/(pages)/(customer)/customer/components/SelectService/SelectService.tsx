import { ChangeEvent } from 'react';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from '@mui/material';

import { MainButton } from '@/components/Button/Button';

import styles from './selectService.module.scss';

interface Props {
  services:
    | {
        id: string;
        name: string;
        duration: number;
      }[]
    | undefined;
  openDrawer: boolean;
  closeDrawer: () => void;
  processCreateAppointment: () => void;
  handleSelectService: (event: ChangeEvent<HTMLInputElement>) => void;
  selectedServicesId: string[];
}

export function SelectService({
  services,
  openDrawer,
  closeDrawer,
  handleSelectService,
  selectedServicesId,
  processCreateAppointment,
}: Props) {
  return (
    <Drawer
      anchor="bottom"
      open={openDrawer}
      onClose={closeDrawer}
      slotProps={{
        paper: {
          sx: {
            borderTopLeftRadius: '40px',
            borderTopRightRadius: '40px',
          },
        },
      }}
    >
      <Box className={styles.container}>
        <Typography className={styles.title}>Select Service</Typography>
        <Box>
          <FormGroup className={styles.wrapper} onChange={handleSelectService}>
            {services?.map((s) => (
              <FormControlLabel
                className={`${styles.serviceItem} ${selectedServicesId.includes(s.id) && styles.selectedService}`}
                key={s.id}
                labelPlacement="start"
                value={s.duration}
                control={<Checkbox id={s.id} name={s.name} />}
                label={s.name}
              />
            ))}
          </FormGroup>
        </Box>
        <Box className={styles.action}>
          <MainButton
            title="Next"
            buttonProps={{ onClick: processCreateAppointment }}
          />
        </Box>
      </Box>
    </Drawer>
  );
}
