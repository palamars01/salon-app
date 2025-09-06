'use client';
import { ReactNode } from 'react';

import { Box } from '@mui/material';

import styles from './modalWrapper.module.scss';

interface Props {
  children: ReactNode;
}

export function ModalWrapper({ children }: Props) {
  return <Box className={styles.container}>{children}</Box>;
}
