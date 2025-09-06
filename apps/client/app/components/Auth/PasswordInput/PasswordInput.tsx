import { BaseTextInput } from '@/components/BaseInput/BaseTextInput';
import { KeyIcon } from '@/components/Icons/KeyIcon';

import { ShowPasswordButton } from '../ShowPassword/ShowPasswordButton';

interface Props {
  label: string;
  showPassword: boolean;
  handleShowPassword: () => void;
  name?: string;
  placeholder?: string;
  id?: string;
}
export function PasswordInput({
  showPassword,
  handleShowPassword,
  label,
  name = 'password',
  placeholder = 'Enter password',
  id = 'password',
}: Props) {
  return (
    <BaseTextInput
      label={label}
      type={showPassword ? 'text' : 'password'}
      inputProps={{
        name,
        placeholder,
        pattern: '[0-9]',
        minLength: 8,
        required: true,
        id,
      }}
      startAdornment={<KeyIcon />}
      endAdornment={
        <ShowPasswordButton
          showPassword={showPassword}
          handleShowPassword={handleShowPassword}
        />
      }
    />
  );
}
