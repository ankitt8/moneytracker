import TransactionCategoriesPage from '@moneytracker/common/src/pages/TransactionCategoriesPage';
interface ITransactionCategoriesPageProps {
  userId: string;
}
export default function  Page({ userId }: ITransactionCategoriesPageProps){
  return <TransactionCategoriesPage userId={userId} />;
}
