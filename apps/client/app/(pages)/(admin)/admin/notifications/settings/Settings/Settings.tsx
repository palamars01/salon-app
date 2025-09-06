'use client';

import { ChangeEvent, useCallback, useState } from 'react';
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Switch,
} from '@mui/material';
import { PageNav } from '@/components/PageNav/PageNav';
import { MainButton } from '@/components/Button/Button';

import { updateUser } from '@/lib/actions/user';
import { NotificationsType } from '@repo/shared/enums';

import styles from './settings.module.scss';

interface Props {
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
    await updateUser({ notificationsSettings });
  }, [notificationsSettings]);

  return (
    <Box>
      <PageNav title="Notifications Settings" nav={true} />
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
        <FormControl className={styles.preferred} component="fieldset">
          <FormLabel className={styles.label} component="p">
            Preferred Communication Method
          </FormLabel>

          <FormControlLabel
            name="preferred"
            value="sms"
            control={
              <Checkbox
                color="primary"
                onChange={handleNotificationsSettingsChange}
                checked={
                  notificationsSettings.preferred === NotificationsType.sms
                }
              />
            }
            label="SMS"
            labelPlacement="end"
            slotProps={{ typography: { component: 'p' } }}
          />
          <FormControlLabel
            name="preferred"
            value="push"
            control={
              <Checkbox
                color="primary"
                onChange={handleNotificationsSettingsChange}
                checked={
                  notificationsSettings.preferred === NotificationsType.push
                }
              />
            }
            label="Push Notifications"
            labelPlacement="end"
            slotProps={{ typography: { component: 'p' } }}
          />
        </FormControl>
        <MainButton title="Save" buttonProps={{ onClick: handleSubmit }} />
      </Box>
    </Box>
  );
}
