import React from 'react'
import {useSelector} from 'react-redux';
import {getNoOfDaysCurrentMonth, getNoOfDaysRemainingCurrentMonth} from '../../helpers/helper';
import './styles.scss';

export default function TransactionSummary() {
    // @ts-ignore
    const {bank, cash} = useSelector(state => state.transactions.transactionSummary);
    const {debit: bankDebit, credit: bankCredit} = bank;
    const {debit: cashDebit, credit: cashCredit} = cash;

    const noOfDays = getNoOfDaysCurrentMonth();
    const daysRemaining = getNoOfDaysRemainingCurrentMonth(noOfDays);
    return (
        <div className="transaction-summary">
            <div className="transaction-summary-heading">
                <div>Bank</div>
                <div>
                    <button className='credit-debit-button credit'>Credit</button>
                    {bankCredit} -
                    <button className='credit-debit-button debit'>Debit</button>{bankDebit}
                    = {bankCredit - bankDebit}
                </div>
            </div>
            <div className="transaction-summary-heading">
                <div>Cash</div>
                <div>
                    <button className='credit-debit-button credit'>Credit</button>
                    {cashCredit} -
                    <button className='credit-debit-button debit'>Debit</button>{cashDebit}
                    = {cashCredit - cashDebit}
                </div>
            </div>
            <div className="transaction-summary-heading">
                <div>Spent {bankDebit + cashDebit}</div>
                <div>Days Left {daysRemaining}</div>
            </div>
        </div>
    )
}
