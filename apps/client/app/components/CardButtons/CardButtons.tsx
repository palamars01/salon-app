'use client';

import { useRouter } from 'next/navigation';
import { Box, Button, ButtonProps } from '@mui/material';

import { HANDLERS_ID } from '@/lib/types/types';

import { getHandler } from './handlers';

import styles from './cardButtons.module.scss';

interface Props {
  lButton: {
    title: string;
    color?: string;
    props?: ButtonProps;
    handler?: {
      id: HANDLERS_ID;
      props?: any;
    };
  };
  rButton: {
    title: string;
    bgColor?: string;
    textColor?: string;
    props?: ButtonProps;
    handler?: {
      id: HANDLERS_ID;
      props?: any;
    };
  };
  cssWrraper?: string;
}

export function CardButtons({ lButton, rButton, cssWrraper }: Props) {
  const router = useRouter();

  let lHandler, rHandler;

  if (lButton?.handler?.id) {
    lHandler = getHandler(lButton.handler.id)(router, lButton.handler.props);
  }
  if (rButton?.handler?.id) {
    rHandler = getHandler(rButton.handler.id)(router, rButton.handler.props);
  }

  return (
    <Box className={`${styles.actions} ${cssWrraper}`}>
      <Button
        component="button"
        variant="outlined"
        className={styles.left}
        sx={{
          border: `1px solid ${lButton.color}`,
          color: lButton.color,
        }}
        onClick={lHandler || null}
        {...lButton.props}
      >
        {lButton.title}
      </Button>
      <Button
        component="button"
        variant="contained"
        className={styles.right}
        sx={{
          backgroundColor: rButton.bgColor,
          color: rButton.textColor,
        }}
        onClick={rHandler || null}
        {...rButton.props}
      >
        {rButton.title}
      </Button>
    </Box>
  );
}
