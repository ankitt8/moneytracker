import { AppProps } from "next/app";
import { useRouter } from 'next/router';
import AppProvider from '@moneytracker/common/src/AppProvider';
import FixedBottomNavBar from '@moneytracker/common/src/components/FixedBottomNavBar';
import { getCookie } from 'cookies-next';
import { useEffect, useState } from "react";
export default function App({Component, pageProps}: AppProps) {
  const router = useRouter();
  const isLoginPage = router.pathname === '/login';
  const [userId, setUserId] = useState("");
  useEffect(() => {
    const userId = getCookie('userId') as string;
    if(typeof window !== undefined) {
      (window as any).userId = userId;
    }
    setUserId(userId);
  },[]);
  return <AppProvider>
    <>
      <Component {...pageProps} userId={userId} />
      {!isLoginPage ? <FixedBottomNavBar userId={userId} /> : null}
    </>
  </AppProvider>
}
