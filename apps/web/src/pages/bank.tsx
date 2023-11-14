import BankAccountsPage from '@moneytracker/common/src/pages/BankAccountsPage';
import { getCookieValue } from '@/utils/cookie';
import { COOKIE_NAMES, ROUTES } from '@moneytracker/common/src/Constants';
import { getServerSidePropsReturnObjUserNotLoggedIn } from '@/utils/utility';
interface IBankAccountsPageProps {
  userId: string;
}
export default function Page({ userId }: IBankAccountsPageProps) {
  return <BankAccountsPage userId={userId} />;
}

export async function getServerSideProps({ req }) {
  const userId = getCookieValue(req?.cookies, COOKIE_NAMES.userId);
  if (!userId) {
    const temp = {
      userId,
      redirectUrl: ROUTES.LOGIN,
      currentUrl: '/'
    };
    return getServerSidePropsReturnObjUserNotLoggedIn(temp);
  }
  return {
    props: {
      userId: getCookieValue(req?.cookies, COOKIE_NAMES.userId)
    }
  };
}
