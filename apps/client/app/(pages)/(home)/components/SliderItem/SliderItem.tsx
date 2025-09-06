import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import React from 'react';

import styles from './sliderItem.module.scss';

interface Props {
  image: {
    id: number;
    title: string;
    description: string;
    src: string;
  };
}

export function SliderItem({ image }: Props) {
  return (
    <Box className={styles.container}>
      <Image src={image.src} alt={image.title} width={305} height={387} />
      <Typography className={styles.title}>{image.title}</Typography>
      <Typography className={styles.description}>
        {image.description}
      </Typography>
    </Box>
  );
}
