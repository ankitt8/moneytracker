import CreditCardsPage from '@moneytracker/common/src/pages/CreditCardsPage';
import { COOKIE_NAMES, ROUTES } from '@moneytracker/common/src/Constants';
import { getCookieValue } from '@/utils/cookie';
import { GetServerSidePropsContext } from 'next/types';
import { getServerSidePropsReturnObjUserNotLoggedIn } from '@/utils/utility';
interface ICreditCardsPageProps {
  userId: string;
}
export default function Page({ userId }: ICreditCardsPageProps) {
  return <CreditCardsPage userId={userId} />;
}

export async function getServerSideProps({ req }: GetServerSidePropsContext) {
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
