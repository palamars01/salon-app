'use server';

import { Box } from '@mui/material';

import { AddSalonForm } from '@/components/AddSalonForm/AddSalonForm';
import { ArrowGoBackButton } from '@/components/ArrowGoBackButton/ArrowGoBackButton';

import styles from './create.module.scss';

export default async function SalonDashboardPage() {
  return (
    <Box className={styles.container}>
      <ArrowGoBackButton />
      <AddSalonForm />
    </Box>
  );
}
