import { MouseEvent } from 'react';

import { IconButton } from '@mui/material';

import { VisibilityOffIcon } from '../../Icons/VisibilityOffIcon';
import { VisibilityIcon } from '../../Icons/VisibilityIcon';

interface Props {
  showPassword: boolean;
  handleShowPassword: () => void;
}
export function ShowPasswordButton({
  showPassword,
  handleShowPassword,
}: Props) {
  const handleMouseEvent = (event: MouseEvent<HTMLButtonElement>) =>
    event.preventDefault();

  return (
    <IconButton
      aria-label={showPassword ? 'hide the password' : 'display the password'}
      onClick={handleShowPassword}
      onMouseDown={handleMouseEvent}
      onMouseUp={handleMouseEvent}
      edge="end"
    >
      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
    </IconButton>
  );
}
