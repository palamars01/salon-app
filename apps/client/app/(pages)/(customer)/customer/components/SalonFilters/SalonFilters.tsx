import { Box, Drawer, FormGroup, TextField, Typography } from '@mui/material';

import styles from './salonFilters.module.scss';
import { MainButton } from '@/components/Button/Button';
import { ChangeEvent } from 'react';

interface Props {
  filters: Record<string, string | number>;
  openFilters: boolean;
  closeFilters: () => void;
  handleChangeFilters: (e: ChangeEvent<HTMLInputElement>) => void;
  handleApplyFilters: () => void;
  handleResetFilters: () => void;
}

export function SalonFilters({
  filters,
  openFilters,
  closeFilters,
  handleChangeFilters,
  handleApplyFilters,
  handleResetFilters,
}: Props) {
  return (
    <Drawer
      anchor="bottom"
      open={openFilters}
      onClose={closeFilters}
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
        <Box>
          <Typography className={styles.title}>Filters</Typography>
          <FormGroup className={styles.wrapper} onChange={handleChangeFilters}>
            <Typography className={styles.filterTitle}>Wait Time</Typography>
            <FormGroup className={styles.waitTime}>
              <TextField
                id="waitTime"
                name="from"
                placeholder="Upper limit in minutes"
                size="small"
                type="text"
                value={filters?.waitTime || ''}
                slotProps={{
                  input: {
                    inputProps: { pattern: '[0-9]' },
                  },
                }}
              />
            </FormGroup>
          </FormGroup>
        </Box>
        <Box className={styles.action}>
          <MainButton
            title="Apply Filters"
            buttonProps={{ onClick: handleApplyFilters }}
          />
          {Object.values(filters).length && (
            <MainButton
              title="Reset Filters"
              buttonProps={{
                onClick: handleResetFilters,
                variant: 'outlined',
                color: 'warning',
              }}
            />
          )}
        </Box>
      </Box>
    </Drawer>
  );
}
