import { AddTransaction } from 'components/AddTransactionModal/interface';
import { url } from 'Constants';

export async function getTransactionsFromDB({
  userId,
  startDate,
  endDate,
  month,
  year
}: {
  userId: string;
  startDate?: string;
  endDate?: string;
  month?: string;
  year?: string;
}): Promise<any> {
  try {
    const res = await fetch(url.API_URL_GET_TRANSACTIONS, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        userId,
        startDate,
        endDate,
        month,
        year
      })
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
interface IBankAccountDetails {
  bankName: string;
}

export const addBankAccountDB = async (
  userId: string,
  bankAccountDetails: IBankAccountDetails
) => {
  try {
    const res = await fetch(url.API_URL_ADD_BANK_ACCOUNT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId, ...bankAccountDetails })
    });
    return await res.json();
  } catch (e) {
    return null;
  }
};
export const editBankAccountDB = async (bankAccountId: string) => {
  return await fetch(url.API_URL_EDIT_BANK_ACCOUNT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ bankAccountId: bankAccountId })
  });
};

export const deleteBankAccountDB = async (
  userId: string,
  newBankAccounts: string[]
) => {
  const res = await fetch(url.API_URL_DELETE_BANK_ACCOUNT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userId, newBankAccounts })
  });
  return await res.json();
};

export async function getBankAccountsFromDB(userId: string): Promise<any> {
  try {
    const res = await fetch(url.API_URL_GET_BANK_ACCOUNTS, {
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
