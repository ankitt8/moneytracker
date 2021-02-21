import React from 'react';
import './styles.scss';

interface TransactionSummaryHeadingPropsInterface {
    typeOfTransaction: string;
    creditAmount: number;
    debitAmount: number;
}

const CreditDebitSummaryAndAdd: React.FC<TransactionSummaryHeadingPropsInterface> = ({
                                                                                         typeOfTransaction,
                                                                                         creditAmount,
                                                                                         debitAmount
                                                                                     }) => {
    return (
        <div className="credit-debit-summary">
            <div className='type-of-transaction'>{typeOfTransaction}</div>
            <div className='balance-and-add-transaction'>
                <div>
                    <button className='credit-debit-button'>CR</button>
                    {creditAmount}
                </div>
                <div>-</div>
                <div>
                    <button className='credit-debit-button'>DR</button>
                    {debitAmount}
                </div>
                <div>=</div>
                <div>
                    {creditAmount - debitAmount}
                </div>
            </div>

        </div>
    )
}

export default CreditDebitSummaryAndAdd;