import { AppProps } from "next/app";
import { useRouter } from 'next/router';
import AppProvider from '@moneytracker/common/src/AppProvider';
import FixedBottomNavBar from '@moneytracker/common/src/components/FixedBottomNavBar';
import { getCookie } from 'cookies-next';
import { useEffect, useState } from "react";
export default function App({Component, pageProps}: AppProps) {
  console.log(pageProps)
  const router = useRouter();
  const isLoginPage = router.pathname === '/login';
  console.log(getCookie('userId'));
  useEffect(() => {
    const userId = getCookie('userId') as string;
    if(typeof window !== undefined) {
      (window as any).userId = userId;
    }
  },[]);
  return <AppProvider>
    <>
      <Component {...pageProps} />
      {!isLoginPage ? <FixedBottomNavBar /> : null}
    </>
  </AppProvider>
}
