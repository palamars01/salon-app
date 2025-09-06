'use client';
import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

import styles from './timer.module.scss';

interface Props {
  arrivalTime: string;
}

export function Timer({ arrivalTime }: Props) {
  const [currentCountdown, setCurrentCountDown] = useState({
    h: 0,
    m: 0,
    s: 0,
    end: false,
    initial: true,
  });
  const [offset, setOffset] = useState(900);
  const [pointer, setPointer] = useState(0);

  const addLeadingZero = (value: number) =>
    value.toString().length === 1 ? '0' + value : value;

  /* Initial countdown setup */
  const setCountDown = () => {
    const arrivalDate = new Date(arrivalTime).getTime();
    const now = new Date().getTime();
    const diff = arrivalDate - now;

    /* Get hours */
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    /* Get minutes */
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    /* Get seconds */
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    setCurrentCountDown({
      h,
      m,
      s,
      end: h <= 0 && m <= 0 && s <= 0,
      initial: false,
    });
  };

  const handleCountdown = () => {
    const countdown = setInterval(() => {
      if (!currentCountdown.end) {
        /* Current minutes and hours*/
        let { h, m, s } = currentCountdown;

        /* Updates */
        if (s > 0) {
          s = currentCountdown.s - 1;
        } else {
          if (m > 0) {
            s = 59;
            m = currentCountdown.m - 1;
          } else {
            if (h > 0) {
              h = currentCountdown.h - 1;
            }
          }
        }

        const end = h + m + s < 1;

        /* Circle offset if hours exists */
        const offsetHH = h ? 900 - (900 * +h) / 24 : 0;
        /* Circle offset if minutes exists */
        const offsetMM = m ? 900 - (900 * +m) / 60 : 0;
        /* Circle offset if seconds exists */
        const offsetSS = s ? 900 - (900 * +s) / 60 : 0;

        let currentOffset = offsetHH || offsetMM || offsetSS;

        if (end) {
          /* Initial offset */
          currentOffset = 900;
        }
        /* Circle pointer rotation degrees if hours exists */
        const pointerHH = h * 15;
        /* Circle pointer rotation degrees if minutes exists */
        const pointerMM = m * 6;
        /* Circle pointer rotation degrees if seconds exists */
        const pointerSS = s * 6;

        const currentPointer = pointerHH || pointerMM || pointerSS;

        setCurrentCountDown({
          h,
          m,
          s,
          end,
          initial: false,
        });
        setPointer(currentPointer);
        setOffset(currentOffset);
      }
    }, 1000);

    return countdown;
  };

  /* useEffects */
  useEffect(() => {
    setCountDown();
  }, []);

  useEffect(() => {
    const countdown = handleCountdown();

    if (currentCountdown.end) clearInterval(countdown);
    /* Clear interval */
    return () => clearInterval(countdown);
  }, [currentCountdown]);

  return (
    <Box className={styles.circle}>
      <Box
        className={styles.pointer}
        style={{}}
        sx={{ transform: `translateX(0px) rotateZ(${pointer}deg)` }}
      ></Box>
      <svg>
        <circle />
        <circle style={{ strokeDashoffset: offset }} />
      </svg>

      {!currentCountdown.initial && (
        <Box className={styles.time}>
          <Typography>
            {!currentCountdown.end
              ? ` ${addLeadingZero(currentCountdown.h)} : ${addLeadingZero(currentCountdown.m)} : ${addLeadingZero(currentCountdown.s)}`
              : 'Your turn'}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
