import { AddTransaction } from '@moneytracker/common/src/components/AddTransactionModal/interface';
import { url } from '@moneytracker/common/src/Constants';
import {
  PaymentInstruments,
  Transaction
} from '@moneytracker/common/src/interfaces';

export async function getTransactionsFromDB(getTransactionsFilter: {
  userId: string;
  startDate?: string;
  endDate?: string;
  month?: string;
  year?: string;
  categories?: string[] | null;
  transactionTypes?: string[];
  selectedBankAccounts?: string[];
  selectedCreditCards?: string[];
}): Promise<any> {
  try {
    const res = await fetch(url.API_URL_GET_TRANSACTIONS, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(getTransactionsFilter)
    });
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getTransactionCategoriesFromDB(
  userId: string
): Promise<any> {
  try {
    const res = await fetch(url.API_URL_GET_TRANSACTION_CATEGORIES, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId: userId })
    });
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export const addTransactionDB = async (transaction: AddTransaction) => {
  const addTransactionResponse = await fetch(url.API_URL_ADD_TRANSACTION, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(transaction)
  });
  return await addTransactionResponse.json();
};

export const editTransactionDB = async (
  transactionId: string,
  updatedTransaction: Transaction
) => {
  const updatedTransactionResponse = await fetch(
    `${url.API_URL_EDIT_TRANSACTION}/?id=${transactionId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedTransaction)
    }
  );
  const updatedTransactionObject = await updatedTransactionResponse.json();
  return Promise.resolve(updatedTransactionObject);
};
export const deleteTransactionDB = async (transactionId: string) => {
  const response = await fetch(
    `${url.API_URL_DELETE_TRANSACTION}/?id=${transactionId}`,
    {
      method: 'POST'
    }
  );
  return await response.json();
};
export const addTransactionCategoryToDB = async (
  userId: string,
  category: string,
  type: string
) => {
  const typeUrl = url.API_URL_ADD_TRANSACTION_CATEGORY;
  return await fetch(typeUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userId,
      category,
      type
    })
  });
};

export const deleteTransactionCategoryFromDB = async (
  userId: string,
  categories: string[],
  type: string
) => {
  const typeUrl = url.API_URL_DELETE_TRANSACTION_CATEGORY;
  return await fetch(typeUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userId,
      categories,
      type
    })
  });
};
interface IPaymentInstrumentDetails {
  paymentInstrumentName: string;
}

export const addPaymentInstrumentDB = async (
  userId: string,
  flag: PaymentInstruments,
  paymentInstrumentDetails: IPaymentInstrumentDetails
) => {
  try {
    const res = await fetch(url.API_URL_ADD_PAYMENT_INSTRUMENT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId,
        flag,
        paymentInstrumentName: paymentInstrumentDetails.paymentInstrumentName
      })
    });
    return await res.json();
  } catch (e) {
    return null;
  }
};

export const deletePaymentInstrumentDB = async (
  flag: PaymentInstruments,
  userId: string,
  newPaymentInstruments: string[]
) => {
  const res = await fetch(url.API_URL_DELETE_PAYMENT_INSTRUMENT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userId, flag, newPaymentInstruments })
  });
  return await res.json();
};

export async function getPaymentInstrumentsFromDB(
  userId: string,
  flag: PaymentInstruments.creditCards | PaymentInstruments.bankAccounts
): Promise<any> {
  try {
    const res = await fetch(url.API_URL_GET_PAYMENT_INSTRUMENTS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId: userId, flag })
    });
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}
