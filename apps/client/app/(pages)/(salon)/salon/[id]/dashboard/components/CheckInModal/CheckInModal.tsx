import { ChangeEvent, useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { toast } from 'react-toastify';

import { ModalWrapper } from '@/components/ModalWrapper/ModalWrapper';
import { MainButton } from '@/components/Button/Button';

import { DashboardAppointment } from '@repo/shared/interfaces/appointment';
import { AppointmentStatusEnum } from '@repo/shared/enums';
import {
  bulkCheckIn,
  getAppointmentsByStatus,
} from '@/lib/actions/appointment';

import { CutomerWaitingCard } from '../CutomerWaitingCard/CutomerWaitingCard';

import styles from './checkInModal.module.scss';

interface Props {
  salonId: string;
  handleClose: () => void;
}

export function CheckInModal({
  salonId,

  handleClose,
}: Props) {
  const [appointments, setAppointments] = useState<
    DashboardAppointment[] | null
  >(null);
  const [selectedAppointments, setSelectedAppointments] = useState<string[]>(
    [],
  );

  const handleSelectCheckIn = (e: ChangeEvent<HTMLInputElement>) => {
    let updatedSelectedAppointments = [...selectedAppointments];
    if (selectedAppointments.includes(e.target.id)) {
      updatedSelectedAppointments = updatedSelectedAppointments.filter(
        (a) => a !== e.target.id,
      );
    } else {
      updatedSelectedAppointments.push(e.target.id);
    }

    setSelectedAppointments(updatedSelectedAppointments);
  };

  const handleBulkCheckIn = async () => {
    if (selectedAppointments.length) {
      const { data, errors } = await bulkCheckIn(selectedAppointments);

      if (data?.modifiedCount) {
        toast.success(
          `${data?.modifiedCount} appointment/s were updated successfuly`,
        );
      } else {
        errors?.forEach((e) => toast.error(e));
      }
      setAppointments(null);
      setSelectedAppointments([]);
    } else return;
  };

  useEffect(() => {
    if (appointments === null)
      getAppointmentsByStatus(AppointmentStatusEnum.approved, salonId).then(
        ({ data }) => setAppointments(data.appointments!.list),
      );
  }, [appointments]);

  return (
    <ModalWrapper>
      <Box className={styles.container}>
        <Typography className={styles.title}>Check In</Typography>
        {appointments?.length ? (
          <Box className={styles.customersWrapper}>
            {appointments?.map((a, i) => (
              <CutomerWaitingCard
                key={a.id}
                customer={a.customer}
                i={i + 1}
                handleSelectCheckIn={handleSelectCheckIn}
                appointmentId={a.id}
              />
            ))}
          </Box>
        ) : (
          <Typography sx={{ textAlign: 'center', fontSize: '16px' }}>
            {!appointments
              ? 'Loading...'
              : 'There are no waiting appointments.'}
          </Typography>
        )}
        <Box className={styles.buttons}>
          <MainButton
            title="Cancel"
            buttonProps={{
              variant: 'outlined',
              onClick: () => {
                setSelectedAppointments([]);
                handleClose();
              },
            }}
          />
          {!!appointments?.length && (
            <MainButton
              title="Check In"
              buttonProps={{ onClick: handleBulkCheckIn }}
            />
          )}
        </Box>
      </Box>
    </ModalWrapper>
  );
}
