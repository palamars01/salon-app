import { registerAs } from '@nestjs/config';

export default registerAs('google-auth', () => ({
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
  FRONTEND_CALLBACK_URL: process.env.FRONTEND_URL + '/api/auth/google',
}));
