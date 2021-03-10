import React from 'react';
import TransactionCard from 'components/TransactionCard';
import { DayTransactionsCardProps } from './interface';
import './styles.scss';
import { TransactionInterface } from 'helper';


const DayTransactionsCard: React.FC<DayTransactionsCardProps> = ({
    transactions,
    title,
    totalAmount
}) => {
    const transactionsList = transactions.map((transaction: TransactionInterface) => {
        const { _id: id } = transaction;
        return <TransactionCard key={id.toString()} transaction={transaction} />
    })
    return (
        <div className='day-transaction-card'>
            <div className="transactions-heading">
                <div>{title}</div>
                <div>{totalAmount}</div>
            </div>
            {transactions.length === 0 ? <p className="no-transaction">!!No Transactions Found!!</p> :
                <ul className="list">{transactionsList}</ul>}
        </div>
    )
}

export default DayTransactionsCard;
