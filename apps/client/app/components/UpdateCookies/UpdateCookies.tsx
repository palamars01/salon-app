'use client';
import { updateSessionWithTokens } from '@/lib/utils/utils';
import { JwtTokens } from '@repo/shared/interfaces/jwt';
import { useEffect } from 'react';

interface Props {
  jwtTokens: JwtTokens;
}
export default function UpdateCookies({ jwtTokens }: Props) {
  useEffect(() => {
    if (jwtTokens) {
      updateSessionWithTokens(jwtTokens).then(() => {});
    }
  }, [jwtTokens]);
  return null;
}
