import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import AppProvider from '@moneytracker/common/src/AppProvider';
import FixedBottomNavBar from '@moneytracker/common/src/components/FixedBottomNavBar';
import { useEffect } from 'react';
import { COOKIE_NAMES } from '@moneytracker/common/src/Constants';
import '../styles/global.css';
export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isLoginPage = router.pathname === '/login';
  const userId = pageProps[COOKIE_NAMES.userId];
  useEffect(() => {
    if (typeof window !== undefined) {
      (window as any).userId = userId;
    }
  }, []);
  return (
    <AppProvider>
      <>
        <Component {...pageProps} />
        {!isLoginPage ? <FixedBottomNavBar userId={userId} /> : null}
      </>
    </AppProvider>
  );
}
