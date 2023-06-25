import BankAccountsPage from '@moneytracker/common/src/pages/BankAccountsPage';
interface IBankAccountsPageProps {
  userId: string;
}
export default function  Page({ userId }: IBankAccountsPageProps){
  return <BankAccountsPage userId={userId}/>
}
