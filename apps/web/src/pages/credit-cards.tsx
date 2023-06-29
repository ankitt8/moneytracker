import CreditCardsPage from '@moneytracker/common/src/pages/CreditCardsPage';
interface ICreditCardsPageProps {
  userId: string;
}
export default function  Page({ userId }: ICreditCardsPageProps){
  return <CreditCardsPage userId={userId}/>
}
