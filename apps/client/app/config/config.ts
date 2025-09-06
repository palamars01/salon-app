export const config = {
  NODE_ENV: process.env.NODE_ENV,
  APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
  BACKEND_URL:
    process.env.NODE_ENV === 'development' &&
    process.env.NEXT_PUBLIC_APP_ENV === 'development'
      ? process.env.NEXT_PUBLIC_BACKEND_DEV_URL
      : process.env.NEXT_PUBLIC_BACKEND_PROD_URL,
  SESSION_SECRET: process.env.SESSION_SECRET,
};
