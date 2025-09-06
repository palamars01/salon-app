import Image from 'next/image';
import { Box, Typography } from '@mui/material';

import { PageNav } from '@/components/PageNav/PageNav';

import { guides } from './howToList';

import styles from './howTo.module.scss';

export default function HowToGuides() {
  return (
    <Box>
      <PageNav title="How-To Guides" />
      <Box className={styles.container}>
        {guides.map((g, i) => {
          return (
            <Box key={g.title} className={styles.guidItem}>
              <Typography className={styles.title}>
                {i + 1}. {g.title}
              </Typography>
              <Typography>Overview: {g.overview}</Typography>
              <Box>
                <Typography>Key Tasks:</Typography>
                <Box component="ul">
                  {g.keyTasks.map((t) => (
                    <Box component="li" key={t}>
                      {t}
                    </Box>
                  ))}
                </Box>
              </Box>
              {g.tip && <Typography>Quick Tip: {g.tip}</Typography>}

              <Image
                src="/images/video-plaaceholder.webp"
                alt=""
                width={200}
                height={300}
              />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
