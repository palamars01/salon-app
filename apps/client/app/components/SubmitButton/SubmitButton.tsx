'use client';

import { useFormStatus } from 'react-dom';

import { MainButton, Props } from '../Button/Button';

export function SubmitButton({ buttonProps, ...props }: Props) {
  const { pending } = useFormStatus();

  return (
    <MainButton
      buttonProps={{ disabled: pending, type: 'submit', ...buttonProps }}
      {...props}
    />
  );
}
