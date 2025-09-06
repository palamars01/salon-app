'use client';

import { FormEvent } from 'react';
import { Box } from '@mui/material';
import { redirect } from 'next/navigation';
import { toast } from 'react-toastify';

import { BaseTextInput } from '@/components/BaseInput/BaseTextInput';
import { SubmitButton } from '@/components/SubmitButton/SubmitButton';

import { addPrivateWorker } from '@/lib/actions/privateWorkers';
import { APP_ROUTES } from '@/lib/types/types';

import styles from './addPrivateWorkerForm.module.scss';

interface Props {
  salonId: string;
}
export function AddPrivateWorkerForm({ salonId }: Props) {
  const handleAddPrivateWorker = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const { data, errors } = await addPrivateWorker(formData, salonId);

    if (errors) {
      errors.forEach((e: string) => toast.error(e));
    } else if (data?.salon.id) {
      toast.success(`Personal stylist was added successfully`);
      redirect(APP_ROUTES.PRIVATE_WORKERS.MAIN(salonId));
    }
  };

  return (
    <Box
      component="form"
      className={styles.form}
      onSubmit={handleAddPrivateWorker}
      noValidate
    >
      <BaseTextInput
        type="text"
        label="Name"
        inputProps={{
          name: 'name',
          placeholder: 'Name',
          required: true,
          id: 'name',
        }}
      />
      <BaseTextInput
        type="email"
        label="Email"
        inputProps={{
          name: 'email',
          placeholder: 'Email',
          required: true,
          id: 'email',
        }}
      />
      <BaseTextInput
        type="text"
        label="Temporary password"
        inputProps={{
          name: 'tempPassword',
          placeholder: 'Password',
          required: true,
          id: 'tempPassword',
        }}
      />

      <SubmitButton
        title="Save Personal Stylist"
        buttonProps={{
          variant: 'outlined',
          sx: { textTransform: 'none' },
        }}
        cssClassName={styles.submitButton}
      />
    </Box>
  );
}
