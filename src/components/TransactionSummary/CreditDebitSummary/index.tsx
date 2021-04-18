import React from 'react';
import './styles.scss';
import { CreditDebitSummaryProps } from './interface';

const CreditDebitSummary: React.FC<CreditDebitSummaryProps> = ({
  title,
  creditAmount,
  debitAmount
}) => {
  return (
    <>
      <div className="credit-debit-summary">
        <h2 >{title}</h2>
        <div className='summary'>
          <h2>
            {new Intl.NumberFormat('en-IN').format(creditAmount)}
          </h2>
          <h2>-</h2>
          <h2>
            {new Intl.NumberFormat('en-IN').format(debitAmount)}
          </h2>
          <h2>=</h2>
          <h2>
            {new Intl.NumberFormat('en-IN').format(creditAmount - debitAmount)}
          </h2>
        </div>
      </div>
    </>
  )
}

export default CreditDebitSummary;