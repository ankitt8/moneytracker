import { AddTransaction } from "components/AddTransactionModal/interface";
import { CREDIT_TYPE, url } from "Constants";

export async function getTransactionsFromDB(userId: string): Promise<any> {
  try {
    const res = await fetch(`${url.API_URL_GET_TRANSACTIONS}/${userId}`);
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
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ userId })
    });
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export const addTransactionDB = async (transaction: AddTransaction) => {
  const addTransactionResponse = await fetch(url.API_URL_ADD_TRANSACTION, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(transaction)
  });
  const transactionObject = await addTransactionResponse.json();
  return Promise.resolve(transactionObject);
};

export const addTransactionCategoryToDB = async (
  userId: string,
  category: string,
  type: string
) => {
  let typeUrl = url.API_URL_ADD_DEBIT_TRANSACTION_CATEGORY;
  if (type === CREDIT_TYPE) {
    typeUrl = url.API_URL_ADD_CREDIT_TRANSACTION_CATEGORY;
  }
  return await fetch(typeUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      userId,
      category
    })
  });
};

export const deleteTransactionCategoryFromDB = async (
  userId: string,
  categories: string[],
  type: string
) => {
  let typeUrl = url.API_URL_DELETE_DEBIT_TRANSACTION_CATEGORY;
  if (type === CREDIT_TYPE) {
    typeUrl = url.API_URL_DELETE_CREDIT_TRANSACTION_CATEGORY;
  }
  return await fetch(typeUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      userId,
      categories
    })
  });
};
