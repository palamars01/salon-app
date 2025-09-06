import { Box } from '@mui/material';

import { EmailIcon } from '@/components/Icons/EmailIcon';
import { BaseTextInput } from '@components/BaseInput/BaseTextInput';

export function EmailInput() {
  return (
    <Box>
      <BaseTextInput
        type="email"
        inputProps={{
          name: 'authValue',
          placeholder: 'Enter email',
          required: true,
          id: 'email',
        }}
        startAdornment={<EmailIcon />}
      />
      <input type="hidden" name="authProvider" value="email" />
    </Box>
  );
}

export default EmailInput;
