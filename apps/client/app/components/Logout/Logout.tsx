'use client';
import { usePathname } from 'next/navigation';
import { logout } from '@/lib/actions/auth';
import { IconButton } from '@mui/material';

import { LogoutIcon } from '../Icons/LogoutIcon';

export function Logout() {
  const pathname = usePathname();
  const color = pathname.includes('dashboard') ? '#fff' : '#325928';
  return (
    <IconButton onClick={logout} sx={{ padding: 0 }}>
      <LogoutIcon color={color} />
    </IconButton>
  );
}
