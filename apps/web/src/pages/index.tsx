import HomePage from '@moneytracker/common/src/pages/HomePage';
import { GetServerSidePropsContext } from 'next/types';
import { getTransactionsFromDB } from '@moneytracker/common/src/api-services/api.service';
import { ITransactions } from '@moneytracker/common/src/components/Transactions/interface';
import { getCookieValue } from '@/utils/cookie';
import { COOKIE_NAMES, ROUTES } from '@moneytracker/common/src/Constants';
import { getServerSidePropsReturnObjUserNotLoggedIn } from '@/utils/utility';
export default function Page(pageProps: {
  transactions: ITransactions;
  userId: string;
}) {
  return <HomePage {...pageProps} />;
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
  const transactions = await getTransactionsFromDB({ userId });
  return { props: { transactions, userId } };
}
