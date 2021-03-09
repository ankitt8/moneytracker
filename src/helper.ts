import {
    url,
    CREDIT_TYPE,
    DEBIT_TYPE,
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