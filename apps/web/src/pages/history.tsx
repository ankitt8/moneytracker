import History from '@moneytracker/common/src/pages/History';
import {GetServerSidePropsContext} from "next/types";
interface IHistoryPageProps {
  userId: string;
}
export default function  Page({ userId }:IHistoryPageProps){
  return <History userId={userId}/>
}

export async function getServerSideProps({req}: GetServerSidePropsContext) {
  return {
    props: { userId: req?.cookies?.userId ?? ''}
  }
}
