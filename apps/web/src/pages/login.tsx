import LoginPage from '@moneytracker/common/src/pages/LoginPage';
export default function Page(pageProps) {
  return <LoginPage {...pageProps} />;
}
export async function getServerSideProps({ query }) {
  return {
    props: {
      callbackUrl: query?.callbackUrl
    }
  };
}
