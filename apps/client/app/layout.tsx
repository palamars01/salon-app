// eslint-disable-next-line no-unused-vars
import { type Metadata } from 'next';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { CssBaseline } from '@mui/material';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';

import { ToastContainer } from 'react-toastify';

import { theme } from '@lib/theme/theme';
import { WebSocketProvider } from './lib/utils/socket';
import { getSession } from './lib/session/session';

import { Poppins } from 'next/font/google';

import './global.scss';

const poppins = Poppins({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Salon App',
  description: 'Salon app',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  return (
    <html lang="en">
      <AppRouterCacheProvider options={{ key: 'css', prepend: true }}>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <body className={poppins.variable}>
              <WebSocketProvider userId={session?.user.id}>
                {children}
              </WebSocketProvider>
              <ToastContainer
                position="top-center"
                theme="colored"
                style={{ marginTop: '8px' }}
                toastStyle={{ marginTop: '8px' }}
              />
            </body>
          </ThemeProvider>
        </StyledEngineProvider>
      </AppRouterCacheProvider>
    </html>
  );
}
