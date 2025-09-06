'use client';

import { redirect } from 'next/navigation';
import { FormEvent } from 'react';
import { toast } from 'react-toastify';
import { Box } from '@mui/material';

import { BaseSelectInput } from '@/components/BaseSelectInput/BaseSelectInput';
import { SubmitButton } from '@/components/SubmitButton/SubmitButton';

import { updateUser } from '@/lib/actions/user';
import { APP_ROUTES } from '@/lib/types/types';

export function UpdateUserRole() {
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const { data, errors } = await updateUser(formData);

    if (errors) {
      errors.forEach((e: string) => toast.error(e));
    } else if (data?.user.id) {
      toast.success('Role has been updated');
      redirect(APP_ROUTES.ROUTER);
    }
  };
  return (
    <Box
      component="form"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        padding: '24px 16px',
        height: '100%',
      }}
      onSubmit={handleSubmit}
    >
      <BaseSelectInput label="Select user type" />
      <SubmitButton
        title="Save"
        wrapperStyles={{ width: '100%', mt: 'auto' }}
      />
    </Box>
  );
}
