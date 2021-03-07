import React from 'react';
import TransactionCard from 'components/TransactionCard';
import { TransactionInterface } from 'helper';
import './styles.scss';

interface InterfaceDayTransactionsCardProps {
    transactions: TransactionInterface[];
    date: string;
    totalAmount: number;
}

const DayTransactionsCard: React.FC<InterfaceDayTransactionsCardProps> = ({
    transactions,
    date,
    totalAmount
}) => {
    const transactionsList = transactions.map((transaction) => {
        const { _id: id } = transaction;
        return <TransactionCard key={id.toString()} transaction={transaction} />
    })
    return (
        <div className='day-transaction-card'>
            <div className="transactions-heading">
                <div>{date}</div>
                <div>{totalAmount}</div>
            </div>
            {transactions.length === 0 ? <p className="no-transaction">!!No Transactions Found!!</p> :
                <ul className="list">{transactionsList}</ul>}
        </div>
    )
}

export default DayTransactionsCard;
