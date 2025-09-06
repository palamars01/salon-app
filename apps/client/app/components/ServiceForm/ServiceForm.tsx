'use client';

import { FormEvent } from 'react';
import { redirect } from 'next/navigation';
import { Box, Typography } from '@mui/material';
import { toast } from 'react-toastify';

import { BaseTextInput } from '@/components/BaseInput/BaseTextInput';
import { SubmitButton } from '@/components/SubmitButton/SubmitButton';

import { addSalonService, updateSalonService } from '@/lib/actions/services';
import { APP_ROUTES } from '@/lib/types/types';

import { DayPicker } from './components/DayPicker/DayPicker';

import { Service } from '@repo/shared/interfaces/salon/service';

import styles from './serviceForm.module.scss';

interface Props {
  salonId: string;
  service?: Service;
}
export function ServiceForm({ salonId, service }: Props) {
  /* Save service handler */
  const handleSaveService = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    /* Invoke create or update server action */
    const { data, errors } = service
      ? await updateSalonService(formData, salonId, service.id)
      : await addSalonService(formData, salonId);

    if (errors) {
      errors.forEach((e: string) => toast.error(e));
    } else if (data?.salon.id) {
      const currentAction = service ? 'updated' : 'added';
      toast.success(`Service ${currentAction} successfully`);
      redirect(APP_ROUTES.SERVICES.MAIN(salonId));
    }
  };

  return (
    <Box
      component="form"
      className={styles.form}
      onSubmit={handleSaveService}
      noValidate
    >
      <BaseTextInput
        type="text"
        label="Service name"
        inputProps={{
          name: 'name',
          placeholder: 'Service name',
          required: true,
          defaultValue: service?.name,
          id: 'name',
        }}
      />
      <BaseTextInput
        type="number"
        label="Price"
        inputProps={{
          name: 'price',
          placeholder: 'Price',
          required: true,
          defaultValue: service?.price,
          id: 'price',
        }}
      />
      <BaseTextInput
        type="text"
        label="Estimated Duration"
        inputProps={{
          name: 'estimatedDuration',
          placeholder: 'Estimated Duration',
          required: true,
          defaultValue: service?.estimatedDuration,
          id: 'duration',
        }}
      />

      <Box className={styles.dayPickerWrapper}>
        <Typography className={styles.label}>Availability</Typography>
        <DayPicker availability={service?.availability || []} />
      </Box>

      <SubmitButton
        title="Save Service"
        buttonProps={{
          variant: 'outlined',
          sx: { textTransform: 'none' },
        }}
        cssClassName={styles.submitButton}
      />
    </Box>
  );
}
