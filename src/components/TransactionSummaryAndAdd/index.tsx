import React from 'react'
import {useSelector} from 'react-redux';
import './CreditDebitSummaryAndAdd';
import {getNoOfDaysCurrentMonth, getNoOfDaysRemainingCurrentMonth} from '../../helpers/helper';
import CreditDebitSummaryAndAdd from "./CreditDebitSummaryAndAdd";
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
            <CreditDebitSummaryAndAdd
                typeOfTransaction='Bank '
                creditAmount={bankCredit}
                debitAmount={bankDebit}
            />
            <CreditDebitSummaryAndAdd
                typeOfTransaction='Cash '
                creditAmount={cashCredit}
                debitAmount={cashDebit}
            />

        </div>
    )
}
