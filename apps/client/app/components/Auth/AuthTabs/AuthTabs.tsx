'use client';

import { JSX, ReactNode, useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';

import styles from './authTabs.module.scss';

interface Props {
  PhoneTab: JSX.Element;
  EmailTab: ReactNode;
}

enum AuthProvider {
  phone,
  email,
}

interface TabPanelProps {
  children?: ReactNode;
  index: AuthProvider;
  value: AuthProvider;
}

const tabProps = (index: AuthProvider) => {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  };
};

export function AuthTabs({ PhoneTab, EmailTab }: Props) {
  const [value, setValue] = useState<AuthProvider>(AuthProvider.phone);

  const handleChange = (newValue: AuthProvider) => setValue(newValue);

  return (
    <Box className={styles.container}>
      <Tabs
        variant="fullWidth"
        className={styles.authTabs}
        value={value}
        onChange={(_, value) => handleChange(value)}
        aria-label="authentication tabs"
      >
        {['Phone', 'Email'].map((provider) => (
          <Tab
            key={provider}
            label={provider}
            className={styles.tab}
            {...tabProps(
              AuthProvider[provider.toLowerCase() as 'email' | 'phone'],
            )}
          />
        ))}
      </Tabs>
      <TabPanel value={value} index={AuthProvider.phone}>
        {PhoneTab}
      </TabPanel>
      <TabPanel value={value} index={AuthProvider.email}>
        {EmailTab}
      </TabPanel>
    </Box>
  );
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  if (value === index) {
    return (
      <Box
        role="tabpanel"
        hidden={value !== index}
        id={`tabpanel-${index}`}
        aria-labelledby={`tab-${index}`}
        {...other}
      >
        {children}
      </Box>
    );
  }
}
