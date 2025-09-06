'use client';
import { redirect } from 'next/navigation';
import { Box } from '@mui/material';

import { MainButton } from '@/components/Button/Button';
import { APP_ROUTES } from '@/lib/types/types';

import { sliderData } from './sliderData';
import { SliderItem } from './components/SliderItem/SliderItem';

import Slider, { Settings } from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import styles from './home.module.scss';

const SliderTyped = Slider as unknown as React.ComponentClass<Settings>;

export default function Home() {
  const settings = {
    dots: true,
    mobileFirst: true,
    appendDots: (dots: any) => (
      <Box
        sx={{
          position: 'relative !important',
          bottom: 0,
        }}
      >
        <ul className={styles.dotsWrapper}> {dots} </ul>
      </Box>
    ),
    customPaging: () => <Box sx={{}} className={styles.dots}></Box>,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    <>
      <Box className={styles.container}>
        <Box>
          <SliderTyped {...settings}>
            {sliderData.map((s) => (
              <SliderItem key={s.id} image={s} />
            ))}
          </SliderTyped>
        </Box>
        <Box sx={{ mt: '55px' }}>
          <MainButton
            title="Continue"
            buttonProps={{
              onClick: () => redirect(APP_ROUTES.AUTH.MAIN),
            }}
          />
        </Box>
      </Box>
    </>
  );
}
