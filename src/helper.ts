import { AddTransactionInterface } from 'components/AddTransactionModal/interface';
import {
    url,
    CREDIT_TYPE,
    DEBIT_TYPE,
    CASH_MODE,
    ONLINE_MODE,
} from './Constants';

export interface TransactionInterface {
    _id: object;
    heading: string;
    amount: number;
    date: Date;
    mode: string;
    type?: string;
    category?: string;
}

export interface TransactionsGroupedByCategoriesInterface {
    [key: string]: {
        // declaring empty array too reason when there are no transactions it will be empty
        transactions: TransactionInterface[] | [];
        totalAmount: number | 0;
    }
}

export interface CategoryAmountArrayInterface {
    category: string, totalAmount: number
};

export const sortTransactionsByDate = (a: TransactionInterface, b: TransactionInterface): number => {
    const da = new Date(a.date);
    const db = new Date(b.date);
    // @ts-ignore
    return db - da;
}

export const debitTransaction = (transaction: TransactionInterface) => {
    return transaction.type === DEBIT_TYPE || transaction.type === undefined;
}

export function getNoOfDaysCurrentMonth(): number {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    let noOfDays = 0;
    const dateFirstDay = new Date(year, month, 1);
    while (dateFirstDay.getMonth() === month) {
        noOfDays += 1;
        dateFirstDay.setDate(dateFirstDay.getDate() + 1);
    }
    return noOfDays;
}

export function getNoOfDaysRemainingCurrentMonth(noOfDays: number): number {
    return noOfDays - new Date().getDate();
}

export function createTransactionsGroupedByCategories (
    transactions: TransactionInterface[], categories: string[]
) {
    let transactionsGroupedByCategories: TransactionsGroupedByCategoriesInterface = {
        'No Category': {
            transactions: [],
            totalAmount: 0,
        }
    };
    categories.forEach((category: string) => {
        transactionsGroupedByCategories[category] = {
            transactions: [],
            totalAmount: 0,
        }
    });
    transactions.forEach((transaction) => {
        if (transaction.category === '' || transaction.category === undefined) {
            // @ts-ignore
            transactionsGroupedByCategories['No Category']['transactions'].push(transaction);
            transactionsGroupedByCategories['No Category'].totalAmount += transaction.amount;
        } else {

            // @ts-ignore
            // for now user can add transaction without category
            // reason have not yet made category required
            transactionsGroupedByCategories[transaction.category]['transactions'].push(transaction);
            // @ts-ignore
            transactionsGroupedByCategories[transaction.category].totalAmount += transaction.amount;
        }
    });

    return transactionsGroupedByCategories;
}

export function sortCategoriesDescByTotalAmount(transactionsGroupedByCategories: TransactionsGroupedByCategoriesInterface) {
    const categoryAmountArray: CategoryAmountArrayInterface[] = [];
    Object.keys(transactionsGroupedByCategories).forEach((category: string) => {
        // @ts-ignore
        categoryAmountArray.push({
            category,
            totalAmount: transactionsGroupedByCategories[category]['totalAmount'],
        });
    });
    
    categoryAmountArray.sort((a, b) => {
        return b.totalAmount - a.totalAmount;
    });
    return categoryAmountArray.map((categoryAmount) => categoryAmount.category);
}

export async function getTransactionCategoriesFromDB(userId: object): Promise<any> {
    const res = await fetch(url.API_URL_GET_TRANSACTION_CATEGORIES, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "userId": userId })
    })
    return await res.json();
}

export async function addTransactionCategoryToDB(userId: object, category: string, type: string, ) {
    
    let typeUrl = url.API_URL_ADD_DEBIT_TRANSACTION_CATEGORY;
    if (type === CREDIT_TYPE) {
        typeUrl = url.API_URL_ADD_CREDIT_TRANSACTION_CATEGORY;
    }
    return await fetch(typeUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "userId": userId,
            "category": category,
        })
    });

}

export async function deleteTransactionCategoryFromDB(userId: object, categories: string[], type: string, ) {
    
    let typeUrl = url.API_URL_DELETE_DEBIT_TRANSACTION_CATEGORY;
    if (type === CREDIT_TYPE) {
        typeUrl = url.API_URL_DELETE_CREDIT_TRANSACTION_CATEGORY;
    }
    return await fetch(typeUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "userId": userId,
            "categories": categories
        })
    });

}
export async function addTransactionDB (transaction: AddTransactionInterface) {
    const addTransactionResponse = await fetch(url.API_URL_ADD_TRANSACTION, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction),
    });
    const transactionObject = await addTransactionResponse.json();
    return Promise.resolve(transactionObject);
}

export async function editTransactionDB (transactionId: object, updatedTransaction: TransactionInterface) {
    const updatedTransactionResponse = await fetch(`${url.API_URL_EDIT_TRANSACTION}/?id=${transactionId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedTransaction)
    });
    const updatedTransactionObject = await updatedTransactionResponse.json();
    return Promise.resolve(updatedTransactionObject);
}

export async function deleteTransactionDB (transactionId: object) {
    const response = await fetch(`${url.API_URL_DELETE_TRANSACTION}/?id=${transactionId}`, {
        method: 'POST'
    });
    return await response.json();
}

export const checkCreditTypeTransaction = (transaction: TransactionInterface) => {
    return transaction.type === CREDIT_TYPE;
}

export const checkDebitTypeTransaction = (transaction: TransactionInterface) => {
    return transaction.type === DEBIT_TYPE || transaction.type === undefined;
}
export const checkOnlineModeTransaction = (transaction: TransactionInterface) => {
    return transaction.mode === ONLINE_MODE;
}
export const checkCashModeTransaction = (transaction: TransactionInterface) => {
    return transaction.mode === CASH_MODE;
}
export const calculateTotalAmount = (transactions: TransactionInterface[]) => {
    return transactions.length === 0 ? 0 : transactions.reduce((acc, curr) => acc + curr.amount, 0);
}
export const calculateBankDebitAmount = (bankDebitTransactions: TransactionInterface[]) => {
    return calculateTotalAmount(bankDebitTransactions);
}
export const calculateBankCreditAmount = (bankCreditTransactions: TransactionInterface[]) => {
    return calculateTotalAmount(bankCreditTransactions);
}
export const calculateCashCreditAmount = (cashCreditTransactions: TransactionInterface[]) => {
    return calculateTotalAmount(cashCreditTransactions);
}
export const calculateCashDebitAmount = (cashDebitTransactions: TransactionInterface[]) => {
    return calculateTotalAmount(cashDebitTransactions);
}
