'use client';
import { ChangeEvent, useEffect, useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { toast } from 'react-toastify';

import { SalonCard } from '../SalonCard/SalonCard';
import { SelectService } from '../SelectService/SelectService';
import { AppointmentSuccess } from '../AppointmentSuccess/AppointmentSuccess';
import { SalonFilters } from '../SalonFilters/SalonFilters';
import { SearchInput } from '../SearchInput/SearchInput';

import { ConfirmModal } from '@/components/ConfirmModal/ConfirmModal';
import { FilterIcon } from '@/components/Icons/FilterIcon';

import { CreateAppointmentResponse } from '@repo/shared/interfaces/appointment';
import { CustomerDashboardSalon } from '@repo/shared/interfaces/salon';

import { getSalonsForCustomer } from '@/lib/actions/salon';
import { createAppointment } from '@/lib/actions/appointment';

import styles from './salonsList.module.scss';

interface Props {
  userData: {
    fName?: string;
    phone?: string;
  };
  salonList: CustomerDashboardSalon[];
}

interface SelectedService {
  id: string;
  duration: number;
  name: string;
}

interface CustomCSSProperties extends React.CSSProperties {
  '--filter-bg'?: string;
}

export function SalonsList({ userData, salonList }: Props) {
  const [salons, setSalons] = useState<CustomerDashboardSalon[] | null>(
    salonList,
  );

  const [selectedSalon, setSelectedSalon] =
    useState<CustomerDashboardSalon | null>(null);

  const [selectedServices, setSelectedServices] = useState<SelectedService[]>(
    [],
  );
  const [openConfirmJoinQueue, setOpenConfirmJoinQueue] =
    useState<boolean>(false);

  const [appointmentSuccess, setAppointmentSuccess] =
    useState<CreateAppointmentResponse | null>(null);

  const [userAppointmentData, setUserAppointmentData] = useState(userData);

  const [searchValue, setSearchValue] = useState<string>('');

  const [openFilters, setOpenFilters] = useState<boolean>(false);

  const [filters, setFilters] = useState<Record<string, string | number>>({});

  const debouncedSearchValue = useDebounce(searchValue, 500);

  const handleCloseDrawer = () => {
    setSelectedSalon(null);
    setSelectedServices([]);
  };

  const handleSelectService = ({ target }: ChangeEvent<HTMLInputElement>) => {
    let updatedServicesId = [...selectedServices];
    if (!target.checked) {
      updatedServicesId = updatedServicesId.filter((s) => s.id !== target.id);
    } else {
      updatedServicesId.push({
        id: target.id,
        duration: +target.value,
        name: target.name,
      });
    }
    setSelectedServices(updatedServicesId);
  };

  const handleCreateAppointment = async () => {
    if (selectedSalon && selectedServices.length) {
      const appointment = {
        salon: selectedSalon.id!,
        services: selectedServices,
        privateWorkerId: selectedSalon?.privateWorkerId,
        phone: userAppointmentData.phone,
        fName: userAppointmentData.fName,
      };
      const { data, errors } = await createAppointment(appointment);

      if (data?.appointment.id) {
        toast.success('Appointment created');
        handleCloseDrawer();
        setOpenConfirmJoinQueue(false);
        /* Trigger salons list update */
        setFilters({});
        setAppointmentSuccess(data?.appointment);
      } else if (errors) errors.forEach((e) => toast.error(e));
    } else {
      return;
    }
  };

  const handleChangeUserAppointmentData = async (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    e.preventDefault();

    setUserAppointmentData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const processCreateAppointment = () => {
    if (selectedServices.length) setOpenConfirmJoinQueue(true);
  };

  const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);

    if (!e.target.value.length) {
      getSalonsForCustomer(undefined, true).then(({ data }) =>
        setSalons(data?.salons || []),
      );
    }
  };

  function useDebounce(value: string, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  }

  const handleChangeFilters = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    setFilters({
      ...filters,
      [e.target.id]: e.target.value,
    });
  };

  const handleApplyFilters = async () => {
    if (Object.values(filters).length) {
      let filtersStr = '?';
      for (const [key, value] of Object.entries(filters)) {
        if (value) {
          filtersStr += `${key}=${value}&`;
        }
      }
      // Perform API call with debouncedSearchValue
      getSalonsForCustomer(`${filtersStr.slice(0, -1)}`).then(({ data }) => {
        setOpenFilters(false);
        setSalons(data?.salons || []);
      });
    }
  };

  const handleResetFilters = () => {
    setFilters({});
    setOpenFilters(false);
  };

  /* useEffects */
  useEffect(() => {
    if (!Object.values(filters).length)
      getSalonsForCustomer().then(({ data }) => setSalons(data?.salons || []));
  }, [filters]);

  /* Search */
  useEffect(() => {
    if (debouncedSearchValue) {
      // Perform API call with debouncedSearchValue
      getSalonsForCustomer(`?search=${searchValue}`).then(({ data }) =>
        setSalons(data?.salons || []),
      );
    }
  }, [debouncedSearchValue]);

  return (
    <Box className={styles.container}>
      <Box className={styles.search}>
        <SearchInput
          value={searchValue}
          handleSearchInput={handleSearchInput}
          cssInput={styles.inputWrapper!}
        />
        <IconButton
          className={styles.searchIconWrapper}
          onClick={() => setOpenFilters(true)}
          style={
            {
              '--filter-hover-bg': Object.values(filters).length
                ? 'rgba(50, 89, 40, 0.8)'
                : 'rgba(255,255,255,.3)',
              '--filter-bg': Object.values(filters).length ? '#325928' : '#fff',
            } as CustomCSSProperties
          }
        >
          <FilterIcon
            color={Object.values(filters).length ? '#fff' : '#16001D'}
          />
        </IconButton>
      </Box>
      <SalonFilters
        openFilters={openFilters}
        filters={filters}
        closeFilters={() => setOpenFilters(false)}
        handleChangeFilters={handleChangeFilters}
        handleApplyFilters={handleApplyFilters}
        handleResetFilters={handleResetFilters}
      />
      <Box component="ul" className={styles.salonsList}>
        {salons?.map((salon) => (
          <SalonCard
            key={salon?.privateWorkerId || salon.id}
            salon={salon}
            selectSalon={() => setSelectedSalon(salon)}
          />
        ))}
      </Box>
      {openConfirmJoinQueue && (
        <ConfirmModal
          open={openConfirmJoinQueue}
          handleClose={() => {
            setOpenConfirmJoinQueue(false);
          }}
          handleSubmit={handleCreateAppointment}
          type="appointmentCreate"
          userAppointmentData={userAppointmentData}
          handleChangeUserAppointmentData={handleChangeUserAppointmentData}
          isFNameExists={!!userData.fName}
        />
      )}

      {appointmentSuccess && (
        <AppointmentSuccess
          handleClose={() => setAppointmentSuccess(null)}
          appointmentSuccess={appointmentSuccess}
        />
      )}

      <SelectService
        services={selectedSalon?.services}
        openDrawer={!!selectedSalon}
        closeDrawer={handleCloseDrawer}
        handleSelectService={handleSelectService}
        selectedServicesId={selectedServices.map((s) => s.id)}
        processCreateAppointment={processCreateAppointment}
      />
    </Box>
  );
}
