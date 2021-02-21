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
                {/*Desing 1 below*/}
                {/*<div>*/}
                {/*    {creditAmount}*/}
                {/*    <button className='credit-debit-button credit'>Credit</button>*/}
                {/*</div>*/}
                {/*<div>   - </div>*/}
                {/*<div>*/}
                {/*    {debitAmount}*/}
                {/*    <button className='credit-debit-button debit'>Debit</button>*/}
                {/*</div>*/}
                {/*<div>*/}
                {/*    =*/}
                {/*</div>*/}
                {/*<div>*/}
                {/*    {creditAmount - debitAmount}*/}
                {/*</div>*/}
                {/*Design two side wise*/}
                <div>
                    <button className='credit-debit-button credit'>CR</button>
                    {creditAmount}
                </div>
                <div>-</div>
                <div>
                    <button className='credit-debit-button debit'>DR</button>
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