'use client';

import { ChangeEvent, useState } from 'react';
import {
  Box,
  FormControl,
  FormControlLabel,
  IconButton,
  Switch,
  Typography,
} from '@mui/material';

import { updateSalon } from '@/lib/actions/salon';

import styles from './settings.module.scss';
import { AngleArrow } from '@/components/Icons/AngleArrow';
import Link from 'next/link';
import { APP_ROUTES } from '@/lib/types/types';

interface Props {
  id: string;
  sms: boolean;
  push: boolean;
}

export function Settings(props: Props) {
  const [notificationsSettings, setNotificationsSettings] =
    useState<Props>(props);
  const handleNotificationsSettingsChange = (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const updatedSettings: any = { ...notificationsSettings };
    if (e.target.name) {
      updatedSettings.preferred = e.target.value;
      if (e.target.checked) {
        updatedSettings[e.target.value] = e.target.checked;
      }
    } else {
      updatedSettings[e.target.value] = e.target.checked;
    }
    setNotificationsSettings(updatedSettings);
    handleSubmit(updatedSettings);
  };

  const handleSubmit = async (notificationsSettings: Props) =>
    await updateSalon(props.id, { notificationsSettings });

  return (
    <Box>
      <Box className={styles.container}>
        <Box className={styles.block}>
          <Box className={styles.wrapper}>
            <Typography className={styles.title}>
              Notification Management
            </Typography>
            <FormControl component="fieldset">
              <FormControlLabel
                className={styles.item}
                value="sms"
                control={
                  <Switch
                    className={styles.switch}
                    color="primary"
                    onChange={handleNotificationsSettingsChange}
                    checked={!!notificationsSettings?.sms}
                  />
                }
                label="SMS Notifications"
                labelPlacement="start"
                slotProps={{ typography: { component: 'p' } }}
              />
              <FormControlLabel
                className={styles.item}
                value="push"
                control={
                  <Switch
                    color="primary"
                    onChange={handleNotificationsSettingsChange}
                    checked={!!notificationsSettings?.push}
                  />
                }
                label="Push Notifications"
                labelPlacement="start"
                slotProps={{ typography: { component: 'p' } }}
              />
            </FormControl>
          </Box>
        </Box>
        <Box className={styles.block}>
          <Box className={styles.wrapper}>
            <Typography className={styles.title}>
              Staff Training Resources
            </Typography>
            <Box className={styles.howTo}>
              <Typography>How-To Guides</Typography>
              <IconButton
                LinkComponent={Link}
                href={APP_ROUTES.SALON.SETTINGS.HOW_TO(props.id)}
              >
                <AngleArrow />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
