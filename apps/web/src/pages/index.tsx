import HomePage from "@moneytracker/common/src/pages/HomePage";
import { GetServerSidePropsContext } from 'next/types';
import { getTransactionsFromDB } from '@moneytracker/common/src/api-services/api.service';
import { ITransactions } from '@moneytracker/common/src/components/Transactions/interface';
export default function Page({ transactions }: { transactions: ITransactions}) {
  return <HomePage transactions={transactions}/>
}

export async function getServerSideProps({ req }: GetServerSidePropsContext) {
  const userId = req.cookies.userId;
  const transactions = await getTransactionsFromDB({userId});
  return { props: { transactions } };
}
