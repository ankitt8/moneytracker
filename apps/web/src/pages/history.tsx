import History from '@moneytracker/common/src/pages/History';
interface IHistoryPageProps {
  userId: string;
}
export default function  Page({ userId }:IHistoryPageProps){
  return <History userId={userId}/>
}
