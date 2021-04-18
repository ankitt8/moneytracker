import React from 'react';
import './styles.scss';
import { CreditDebitSummaryProps } from './interface';

const options = {
  style: 'currency',
  currency: 'INR',
  maximumSignificantDigits: 3
}

const CreditDebitSummary: React.FC<CreditDebitSummaryProps> = ({
  title,
  creditAmount,
  debitAmount
}) => {
  return (
    <>
      <div className="credit-debit-summary">
        <div className='title'>{title}</div>
        <div className='summary'>
          <div>
            {new Intl.NumberFormat('en-IN', options).format(creditAmount)}
          </div>
          <div>-</div>
          <div>
            {new Intl.NumberFormat('en-IN', options).format(debitAmount)}
          </div>
          <div>=</div>
          <div>
            {new Intl.NumberFormat('en-IN', options).format(creditAmount - debitAmount)}
          </div>
        </div>
      </div>
    </>
  )
}

export default CreditDebitSummary;