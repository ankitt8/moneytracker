import { AddTransaction } from "components/AddTransactionModal/interface";
import { url } from "Constants";

export async function getTransactionsFromDB(userId: string): Promise<any> {
    const res = await fetch(url.API_URL_GET_TRANSACTIONS + `/${userId}`)
    return await res.json();
}

export async function getTransactionCategoriesFromDB(userId: string): Promise<any> {
    const res = await fetch(url.API_URL_GET_TRANSACTION_CATEGORIES, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "userId": userId })
    })
    return await res.json();
}

export const addTransactionDB = async (transaction: AddTransaction) => {
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