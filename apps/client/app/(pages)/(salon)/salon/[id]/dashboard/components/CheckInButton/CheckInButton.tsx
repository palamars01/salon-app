'use client';

import { useState } from 'react';
import { MainButton } from '@/components/Button/Button';
import { CheckInModal } from '../CheckInModal/CheckInModal';

interface Props {
  id: string;
}

export function CheckInButton({ id }: Props) {
  const [openModal, setOpenModal] = useState<boolean>(false);

  return (
    <>
      {openModal && (
        <CheckInModal
          salonId={id}
          handleClose={() => {
            setOpenModal(false);
          }}
        />
      )}
      <MainButton
        title="Check-In"
        buttonProps={{
          variant: 'contained',
          onClick: () => setOpenModal(true),
          sx: {
            backgroundColor: '#ffffff',
            color: '#4B9443',
            '&:hover': {
              backgroundColor: '#4B9443',
              color: '#ffffff',
            },
          },
        }}
      />
    </>
  );
}
