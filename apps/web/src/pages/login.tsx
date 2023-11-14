import LoginPage from '@moneytracker/common/src/pages/LoginPage';
export default function Page(pageProps) {
  console.log(pageProps);
  return <LoginPage {...pageProps} />;
}
export async function getServerSideProps({ req, query }) {
  return {
    props: {
      callbackUrl: query?.callbackUrl
    }
  };
}
