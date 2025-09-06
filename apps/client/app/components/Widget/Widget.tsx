import { Box, Typography } from '@mui/material';

import { JSX } from 'react';

import styles from './widget.module.scss';

interface Props {
  title: string;
  icon: JSX.Element;
  content: string | number;
  contentIcon?: JSX.Element | string;
  buttomIcon?: JSX.Element | string;
  id?: string;
}

export function Widget({
  icon,
  title,
  content,
  contentIcon,
  buttomIcon,
  id = '',
}: Props) {
  return (
    <Box className={styles.item}>
      <Box className={styles.icon}>{icon}</Box>
      <Typography className={styles.title}>{title}</Typography>
      <Box className={styles.content}>
        <Typography id={id}>{content}</Typography>
        {contentIcon && <Box className={styles.contentIcon}>{contentIcon}</Box>}
      </Box>
      <Box className={styles.icon}>{buttomIcon}</Box>
    </Box>
  );
}
