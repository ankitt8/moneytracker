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
