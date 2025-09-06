import Link from 'next/link';
import { Box, IconButton, Typography } from '@mui/material';
import styles from './listHeader.module.scss';

interface Props {
  title: string;
  button: {
    title: string;
    href: string;
  };
}

export function ListHeader({ title, button }: Props) {
  return (
    <Box className={styles.container}>
      <Typography className={styles.title}>{title}</Typography>
      <IconButton
        LinkComponent={Link}
        href={button.href}
        className={styles.viewAll}
      >
        {button.title}
      </IconButton>
    </Box>
  );
}
