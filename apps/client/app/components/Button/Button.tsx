'use client';
import { Box, Button, ButtonProps, SxProps } from '@mui/material';

import styles from './button.module.scss';

export interface Props {
  title: string;
  buttonProps?: ButtonProps;
  wrapperStyles?: SxProps;
  cssClassName?: string;
}
export function MainButton({
  title,
  wrapperStyles = {},
  buttonProps = {},
  cssClassName = '',
}: Props) {
  return (
    <Box sx={wrapperStyles} className={`${styles.container} ${cssClassName}`}>
      <Button
        sx={{ textTransform: 'none' }}
        className={styles.button}
        variant="contained"
        {...buttonProps}
      >
        {title}
      </Button>
    </Box>
  );
}
