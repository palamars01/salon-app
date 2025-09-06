import {
  FormControl,
  FormHelperText,
  InputAdornment,
  InputBaseComponentProps,
  OutlinedInput,
} from '@mui/material';

import styles from './baseTextInput.module.scss';

interface Props {
  type: string;
  label?: string;
  startAdornment?: any;
  endAdornment?: any;
  inputProps?: InputBaseComponentProps;
  cssWrapper?: string;
  value?: string;
  disabled?: boolean;
}

export function BaseTextInput({
  type = 'text',
  startAdornment,
  endAdornment,
  label = '',
  cssWrapper = '',
  value = undefined,
  inputProps,
  disabled = false,
}: Props) {
  return (
    <FormControl variant="outlined" className={styles.container}>
      {label && (
        <FormHelperText className={styles.label}>{label}</FormHelperText>
      )}
      <OutlinedInput
        value={value}
        disabled={disabled}
        type={type}
        className={`${styles.wrapper} ${cssWrapper}`}
        endAdornment={
          endAdornment && (
            <InputAdornment position="end">{endAdornment}</InputAdornment>
          )
        }
        startAdornment={
          startAdornment && (
            <InputAdornment position="start">{startAdornment}</InputAdornment>
          )
        }
        inputProps={{
          'aria-label': label,
          autoComplete: 'off',
          ...inputProps,
        }}
      />
    </FormControl>
  );
}
