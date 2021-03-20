import React from 'react'
import { useSelector } from 'react-redux';
import './CreditDebitSummaryAndAdd';
// import { getNoOfDaysCurrentMonth, getNoOfDaysRemainingCurrentMonth } from '../../helpers/helper';
import CreditDebitSummaryAndAdd from "./CreditDebitSummaryAndAdd";
import './styles.scss';
import { CASH_MODE, ONLINE_MODE } from '../../Constants';

interface TransactionSummaryAndAddProps {
	userId: object;
}

const TransactionSummaryAndAdd: React.FC<TransactionSummaryAndAddProps> = ({
	userId,
}) => {
	// @ts-ignore
	const { bank, cash } = useSelector(state => state.transactions.transactionSummary);
	const { debit: bankDebit, credit: bankCredit } = bank;
	const { debit: cashDebit, credit: cashCredit } = cash;

	// const noOfDays = getNoOfDaysCurrentMonth();
	// const daysRemaining = getNoOfDaysRemainingCurrentMonth(noOfDays);
	return (
		<div className="transaction-summary">
			<CreditDebitSummaryAndAdd
				userId={userId}
				mode={ONLINE_MODE}
				title='Bank'
				creditAmount={bankCredit}
				debitAmount={bankDebit}
			/>
			<CreditDebitSummaryAndAdd
				userId={userId}
				mode={CASH_MODE}
				title='Cash'
				creditAmount={cashCredit}
				debitAmount={cashDebit}
			/>

		</div>
	)
}

export default TransactionSummaryAndAdd;
