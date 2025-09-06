import { ReactNode } from 'react';

import { Button, ButtonProps } from '@mui/material';

interface Props {
  children: ReactNode;
  cssClassName?: string;
  buttonProps?: ButtonProps;
}

export function ActionButton({
  children,
  buttonProps,
  cssClassName = '',
}: Props) {
  return (
    <Button
      sx={{ padding: '14px 0', height: '52px' }}
      className={cssClassName}
      {...buttonProps}
    >
      {children}
    </Button>
  );
}
