'use client';

import { MainButton } from '@/components/Button/Button';
import { deletePrivateWorker } from '@/lib/actions/privateWorkers';

interface ActionsProps {
  salonId: string;
  privateWorkerId: string;
  cssClass: string;
}
export function Actions({ salonId, privateWorkerId, cssClass }: ActionsProps) {
  return (
    <MainButton
      title="Delete"
      buttonProps={{
        variant: 'outlined',
        onClick: () => deletePrivateWorker(salonId, privateWorkerId),
      }}
      cssClassName={cssClass}
    />
  );
}
