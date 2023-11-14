import TransactionCategoriesPage from '@moneytracker/common/src/pages/TransactionCategoriesPage';
import { GetServerSidePropsContext } from 'next/types';
interface ITransactionCategoriesPageProps {
  userId: string;
}
import { COOKIE_NAMES } from '@moneytracker/common/src/Constants';
import { getCookieValue } from '@/utils/cookie';
import { getServerSidePropsReturnObjUserNotLoggedIn } from '@/utils/utility';
export default function Page({ userId }: ITransactionCategoriesPageProps) {
  return <TransactionCategoriesPage userId={userId} />;
}
export async function getServerSideProps({ req }: GetServerSidePropsContext) {
  const userId = getCookieValue(req?.cookies, COOKIE_NAMES.userId);
  if (!userId) {
    const temp = {
      userId,
      redirectUrl: '/login',
      currentUrl: '/'
    };
    return getServerSidePropsReturnObjUserNotLoggedIn(temp);
  }
  return {
    props: {
      userId
    }
  };
}
