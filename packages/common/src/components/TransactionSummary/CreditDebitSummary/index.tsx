import './styles.scss';
import { CreditDebitSummaryProps } from './interface';
import { getFormattedAmount } from '../../../utility';

const CreditDebitSummary = ({
  title,
  creditAmount,
  debitAmount
}: CreditDebitSummaryProps) => {
  return (
    <>
      <div className="credit-debit-summary">
        <p>{title}</p>
        <div className="summary">
          <p>{getFormattedAmount(creditAmount)}</p>
          <p>-</p>
          <p>{getFormattedAmount(debitAmount)}</p>
          <p>=</p>
          <p>{getFormattedAmount(creditAmount - debitAmount)}</p>
        </div>
      </div>
    </>
  );
};

export default CreditDebitSummary;
