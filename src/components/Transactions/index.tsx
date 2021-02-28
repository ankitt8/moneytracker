import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {
    editBankCreditAction,
    editBankDebitAction,
    editCashCreditAction,
    editCashDebitAction,
    getTransactionsAction,
} from '../../actions/actionCreator'
import Loader from '../Loader';
import { CASH_MODE, CREDIT_TYPE, DEBIT_TYPE, ONLINE_MODE, url } from '../../Constants';
import DayTransactionsCard from '../DayTransaction';
import { debitTransaction, getNoOfDaysCurrentMonth } from '../../helpers/helper'
import { TransactionInterface } from "../../helpers/helper";
import './styles.scss';

const checkCreditTypeTransaction = (transaction: TransactionInterface) => {
    return transaction.type === CREDIT_TYPE;
}
const checkDebitTypeTransaction = (transaction: TransactionInterface) => {
    return transaction.type === DEBIT_TYPE || transaction.type === undefined;
}
const checkOnlineModeTransaction = (transaction: TransactionInterface) => {
    return transaction.mode === ONLINE_MODE;
}
const checkCashModeTransaction = (transaction: TransactionInterface) => {
    return transaction.mode === CASH_MODE;
}
const calculateTotalAmount = (transactions: TransactionInterface[]) => {
    return transactions.length === 0 ? 0 : transactions.reduce((acc, curr) => acc + curr.amount, 0);
}
const calculateBankDebitAmount = (bankDebitTransactions: TransactionInterface[]) => {
    return calculateTotalAmount(bankDebitTransactions);
}
const calculateBankCreditAmount = (bankCreditTransactions: TransactionInterface[]) => {
    return calculateTotalAmount(bankCreditTransactions);
}
const calculateCashCreditAmount = (cashCreditTransactions: TransactionInterface[]) => {
    return calculateTotalAmount(cashCreditTransactions);
}
const calculateCashDebitAmount = (cashDebitTransactions: TransactionInterface[]) => {
    return calculateTotalAmount(cashDebitTransactions);
}

interface InterfaceTransactionsProps {
    userId: object;
}

const Transactions: React.FC<InterfaceTransactionsProps> = ({ userId }) => {
    const dispatch = useDispatch();
    // @ts-ignore
    const storeTransactions = useSelector(state => state.transactions.transactions);
    const [loader, setLoader] = React.useState(true);
    const [transactions, setTransactions] = React.useState(storeTransactions);
    const [offline, setOffline] = React.useState(false);
    if (transactions !== storeTransactions) setTransactions(storeTransactions)

    function sortTransactionsByDate(a: TransactionInterface, b: TransactionInterface): number {
        const da = new Date(a.date);
        const db = new Date(b.date);
        // @ts-ignore
        return db - da;
    }

    const loadTransactions = useCallback(
        async () => {
            try {
                // If there are transactions in store or if its not first day of month
                // then no need to load transactions
                // implies we need to refresh the store if its first day of month
                // also we need to refresh the store if a new user is logged in
                // or user deletes the local storage data
                // local storage is better since I am sure that in a month
                // the user will not store data more than 5MB
                // also got a overview from adding so many transactions still the value didn't cross even 1MB

                //  the code is buggy since it will not sync up from different browsers so commenting below code
                // if (storeTransactions.length !== 0 && new Date().getDate() !== 1) {
                //   setLoader(false);
                //   return;
                // }
                const response = await fetch(url.API_URL_GET_TRANSACTIONS, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ "userId": userId })
                });
                if (response.ok) {
                    const data = await response.json();
                    // to handle the transactions where type debit or credit is not stored
                    // adding undefined match also
                    const debitTransactions = data.filter(checkDebitTypeTransaction);
                    const creditTransactions = data.filter(checkCreditTypeTransaction);

                    const bankCreditTransactions = creditTransactions.filter(checkOnlineModeTransaction);
                    const cashCreditTransactions = creditTransactions.filter(checkCashModeTransaction);
                    const bankDebitTransactions = debitTransactions.filter(checkOnlineModeTransaction);
                    const cashDebitTransactions = debitTransactions.filter(checkCashModeTransaction);

                    const bankCredit = calculateBankCreditAmount(bankCreditTransactions);
                    const bankDebit = calculateBankDebitAmount(bankDebitTransactions);
                    const cashCredit = calculateCashCreditAmount(cashCreditTransactions);
                    const cashDebit = calculateCashDebitAmount(cashDebitTransactions);

                    dispatch(editBankCreditAction(bankCredit));
                    dispatch(editBankDebitAction(bankDebit));

                    dispatch(editCashCreditAction(cashCredit));
                    dispatch(editCashDebitAction(cashDebit));
                    dispatch(getTransactionsAction(data));
                }
                setLoader(false);
            } catch (err) {
                // console.error(err);
                // console.log('Either your internet is disconnected or issue from our side');
                setLoader(false);
                // assuming the error will happen only if failed to get the transactions
                setOffline(true);
            }
        },
        [dispatch, setLoader, userId],
    );
    useEffect(() => {
        loadTransactions();
    }, [loadTransactions]);

    transactions.sort(sortTransactionsByDate);

    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const noOfDays: number = getNoOfDaysCurrentMonth();
    const dayTransactions: any[] = [];
    const todayDate: number = date.getDate();
    const dayTransactionsList: any[] = [];
    let totalAmountPerDay = new Array(noOfDays);
    for (let i = 0; i <= noOfDays; ++i) {
        dayTransactions[i] = [];
    }

    for (const transaction of transactions) {
        const dayTransactionIndex = new Date(transaction.date).getDate();
        dayTransactions[dayTransactionIndex].push(transaction);
    }
    for (let i = todayDate; i >= 1; --i) {
        totalAmountPerDay[i] = dayTransactions[i]
            .filter(debitTransaction)
            .reduce((acc: number, curr: TransactionInterface) => acc + curr.amount, 0);
        dayTransactionsList.push((
            <li key={i}>
                <DayTransactionsCard
                    date={new Date(year, month, i).toDateString()}
                    transactions={dayTransactions[i]}
                    totalAmount={totalAmountPerDay[i]} />
            </li>
        ))
    }
    let componentToRender;
    if (loader) {
        componentToRender = <Loader />;
    } else {
        if (offline) {
            componentToRender = <h2>Please check your internet connection or our servers our down :(</h2>;
        } else {
            componentToRender = <ul className="transactions-list">{dayTransactionsList}</ul>
        }
    }
    return componentToRender;
}

export default Transactions;


