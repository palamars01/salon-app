'use client';

import { useRouter } from 'next/navigation';
import { IconButton } from '@mui/material';

import { LeftArrowIcon } from '@/components/Icons/LeftArrowIcon';

export function ArrowGoBackButton() {
  const router = useRouter();
  return (
    <IconButton
      sx={{ padding: 0, width: '30px', height: '30px' }}
      onClick={() => router.back()}
    >
      <LeftArrowIcon />
    </IconButton>
  );
}
