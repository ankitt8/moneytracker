import { AppProps } from "next/app";
import { useRouter } from 'next/router';
import AppProvider from '@moneytracker/common/src/AppProvider';
import FixedBottomNavBar from '@moneytracker/common/src/components/FixedBottomNavBar';
import { getCookie } from 'cookies-next';
import { useEffect } from "react";
export default function App({Component, pageProps}: AppProps) {
  const router = useRouter();
  const userId = "601fd46d3213727397f3e13e";
  const isLoginPage = router.pathname === '/login';
  useEffect(() => {
    const userId = getCookie('userId');
    window.userId = userId;
  },[]);
  return <AppProvider>
    <Component {...pageProps} userId={userId} />
    {!isLoginPage ? <FixedBottomNavBar /> : null}
  </AppProvider>
}
