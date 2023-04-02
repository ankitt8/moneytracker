import PaymentInstrument from '../../components/PaymentInstrument';
import { PaymentInstruments } from '../../interfaces';

export default function BankAccountsPage({ userId }: { userId: string }) {
  return (
    <PaymentInstrument userId={userId} type={PaymentInstruments.bankAccounts} />
  );
}
