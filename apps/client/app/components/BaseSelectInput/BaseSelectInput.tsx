import { Box } from '@mui/material';

import { AccountIcon } from '../Icons/AccountIcon';
import { SelectArrowIcon } from '../Icons/SelectArrowIcon';

import styles from './baseSelectInput.module.scss';

interface Props {
  label: string;
  selectProps?: {
    name: string;
    id: string;
    options: string[];
    showIcon: boolean;
  };
  cssClass?: string;
}

export function BaseSelectInput({
  label,
  selectProps = {
    name: 'role',
    id: 'role-select',
    options: ['', 'customer', 'salon'],
    showIcon: true,
  },
  cssClass,
}: Props) {
  return (
    <Box className={`${styles.container} ${cssClass}`}>
      <label className={styles.label} htmlFor="role-select">
        {label}
      </label>
      <Box className={styles.wrapper}>
        {selectProps.showIcon && (
          <Box className={styles.accountIconWrapper}>
            <AccountIcon fillColor="#D9D9D9" />
          </Box>
        )}
        <Box className={styles.arrowIconWrapper}>
          <SelectArrowIcon />
        </Box>

        <select name={selectProps.name} id={selectProps.id}>
          {selectProps.options.map((opt) => (
            <option key={opt.toLowerCase()} value={opt.toLowerCase()}>
              {opt}
            </option>
          ))}
        </select>
      </Box>
    </Box>
  );
}
