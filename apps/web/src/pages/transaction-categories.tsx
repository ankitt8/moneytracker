import TransactionCategoriesPage from '@moneytracker/common/src/pages/TransactionCategoriesPage';
import {GetServerSidePropsContext} from "next/types";
interface ITransactionCategoriesPageProps {
  userId: string;
}
export default function  Page({ userId }: ITransactionCategoriesPageProps){
  return <TransactionCategoriesPage userId={userId} />;
}
export async function getServerSideProps({req }:GetServerSidePropsContext) {
  return {
    props: {
      userId: req?.cookies?.userId ?? ''
    }
  }
}
