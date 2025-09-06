'use client';
import { FormEvent } from 'react';
import { useRouter } from 'next/navigation';

import { Box, Typography } from '@mui/material';
import { toast } from 'react-toastify';

import { SubmitButton } from '@/components/SubmitButton/SubmitButton';
import { BaseTextInput } from '@/components/BaseInput/BaseTextInput';

import { createSalon } from '@/lib/actions/salon';
import { APP_ROUTES } from '@/lib/types/types';

import { Salon } from '@repo/shared/interfaces/salon';

import styles from './addSalonForm.module.scss';

export function AddSalonForm() {
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget) as Iterable<
      [Salon, FormDataEntryValue]
    >;
    const { data, errors } = await createSalon(formData);

    if (errors) {
      errors.forEach((e: string) => toast.error(e));
    } else if (data?.salon.id) {
      toast.success('Salon created successfully');

      router.push(APP_ROUTES.SALON.SELECT_SERVICE_MODEL(data.salon.id));
    }
  };
  return (
    <Box className={styles.container}>
      <Box className={styles.header}>
        <Typography className={styles.title}>Register Your Salon</Typography>
        <Typography className={styles.description}>
          Join our platform to manage your queues effectively.
        </Typography>
      </Box>

      <Box
        component="form"
        className={styles.form}
        onSubmit={handleSubmit}
        noValidate
      >
        <BaseTextInput
          type="text"
          label="Salon Name"
          inputProps={{
            name: 'name',
            placeholder: 'Salon name',
            required: true,
            id: 'name',
          }}
        />
        <BaseTextInput
          type="text"
          label="Owner's Name"
          inputProps={{
            name: 'ownerName',
            placeholder: "Owner's Name",
            required: true,
            id: 'ownerName',
          }}
        />
        <BaseTextInput
          type="text"
          label="Salon Address"
          inputProps={{
            name: 'address',
            placeholder: 'Salon Address',
            required: true,
            id: 'address',
          }}
        />
        <BaseTextInput
          type="number"
          label="Employees"
          inputProps={{
            name: 'employees',
            placeholder: 'Total count of employees',
            required: true,
            id: 'employees',
          }}
        />
        <BaseTextInput
          type="text"
          label="City/Region"
          inputProps={{
            name: 'city',
            placeholder: 'City/Region',
            required: true,
            id: 'city',
          }}
        />

        {/* Submit button */}
        <SubmitButton title="Register" cssClassName={styles.buttonWrapper} />
      </Box>
    </Box>
  );
}
