import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {
    setCreditDebitZero,
    editBankCreditAction,
    editBankDebitAction,
    editCashCreditAction,
    editCashDebitAction,
    getTransactionsAction,
} from 'actions/actionCreator';
import Loader from 'components/Loader';
import { url } from 'Constants';
import DayTransactionsCard from 'components/DayTransaction';
import {
    TransactionInterface,
    debitTransaction,
    getNoOfDaysCurrentMonth,
    getTransactionCategoriesFromDB,
    sortTransactionsByDate,
    checkCreditTypeTransaction,
    calculateBankCreditAmount,
    calculateBankDebitAmount,
    calculateCashCreditAmount,
    calculateCashDebitAmount,
    checkCashModeTransaction,
    checkDebitTypeTransaction,
    checkOnlineModeTransaction
} from 'helper';
import { getTransactionCategories } from 'actions/actionCreator';
import styles from './styles.module.scss';


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
    if (transactions !== storeTransactions) {
        setTransactions(storeTransactions)
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
                    // dispatch(editBankCreditAction(0))
                    // Quick Fix
                    dispatch(setCreditDebitZero())
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
        getTransactionCategoriesFromDB(userId)
            .then(({ transactionCategories }) => {
                dispatch(getTransactionCategories(transactionCategories));
            });
        loadTransactions();

    }, [dispatch, loadTransactions, userId]);
    let componentToRender;

    try {
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

        transactions.forEach((transaction: TransactionInterface) => {
            const dayTransactionIndex = new Date(transaction.date).getDate();
            dayTransactions[dayTransactionIndex].push(transaction);
        });

        for (let i = todayDate; i >= 1; --i) {
            totalAmountPerDay[i] = dayTransactions[i]
                .filter(debitTransaction)
                .reduce((acc: number, curr: TransactionInterface) => acc + curr.amount, 0);
            dayTransactionsList.push(
                <DayTransactionsCard
                    key={new Date(year, month, i).toDateString()}
                    title={new Date(year, month, i).toDateString()}
                    transactions={dayTransactions[i]}
                    totalAmount={totalAmountPerDay[i]}
                />
            );
        }
        if (loader) {
            componentToRender = <Loader />;
        } else {
            if (offline) {
                componentToRender = <h2>Please check your internet connection or our servers our down :(</h2>;
            } else {
                componentToRender = <ul className={styles.transactionsList}>{dayTransactionsList}</ul>
            }
        }
    } catch (error) {
        componentToRender = <h2>Something Broke From Our End</h2>
        console.error(error)
    }
    return componentToRender;
}

export default Transactions;


