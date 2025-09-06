'use client';

import { ChangeEvent, useCallback, useState } from 'react';
import { Box, FormControl, FormControlLabel, Switch } from '@mui/material';
import { MainButton } from '@/components/Button/Button';

import { NotificationsType } from '@repo/shared/enums';
import { updateSalon } from '@/lib/actions/salon';

import styles from './settings.module.scss';

interface Props {
  id: string;
  sms: boolean;
  push: boolean;
  preferred: NotificationsType | null;
}

export function NotificationsSettings(props: Props) {
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

      if (
        !e.target.checked &&
        notificationsSettings.preferred ===
          (e.target.value as NotificationsType)
      ) {
        updatedSettings.preferred = null;
      }
    }
    setNotificationsSettings(updatedSettings);
  };

  const handleSubmit = useCallback(async () => {
    await updateSalon(props.id, { notificationsSettings });
  }, [notificationsSettings]);

  return (
    <Box>
      <Box className={styles.container}>
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
        <MainButton title="Save" buttonProps={{ onClick: handleSubmit }} />
      </Box>
    </Box>
  );
}
