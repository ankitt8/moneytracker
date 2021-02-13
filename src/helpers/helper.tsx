import {DEBIT_TYPE} from "../Constants";

export interface TransactionInterface {
    _id: object
    heading: string
    amount: number
    date: Date
    mode: string
    type?: string
}

export const debitTransaction = (transaction: TransactionInterface) => {
    return transaction.type === DEBIT_TYPE || transaction.type === undefined;
}
