import { AppProps } from "next/app";
import dynamic from "next/dynamic";
const AppProvider = dynamic(() => import("@moneytracker/common/src/components/AppProvider"), {
  ssr: false,
});
export default function App({Component, pageProps}: AppProps) {
  return <>
    <AppProvider>
    </AppProvider>
  </>
}
