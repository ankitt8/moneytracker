import styles from './styles.module.scss';
import useApi from '@moneytracker/common/src/customHooks/useApi';
import {
  addPaymentInstrumentDB,
  deletePaymentInstrumentDB,
  getPaymentInstrumentsFromDB
} from '../../api-services/api.service';
import useFetchData from '../../customHooks/useFetchData';
import {
  addUserPaymentInstrumentAction,
  setUserPaymentInstrumentsAction
} from '../../actions/actionCreator';
import { useDispatch } from 'react-redux';
import { PaymentInstruments } from '../../interfaces';
import {
  getPersistedBankAccounts,
  getPersistedCreditCards,
  handleGetBankAccountsApiResponse,
  handleGetCreditCardsApiResponse
} from '../../api-services/utility';
import {
  GET_BANK_ACCOUNTS_FAILURE_MSG,
  GET_CREDIT_CARDS_FAILURE_MSG
} from '../../Constants';
import { useState } from 'react';

interface IPaymentInstrument {
  userId: string;
  type: PaymentInstruments.bankAccounts | PaymentInstruments.creditCards;
}
const PaymentInstrument = ({ userId, type }: IPaymentInstrument) => {
  const dispatch = useDispatch();
  const [paymentInstruments, setPaymentInstruments] = useState(() => {
    return type === PaymentInstruments.bankAccounts
      ? getPersistedBankAccounts()
      : getPersistedCreditCards();
  });
  const handleApiResponse = (res: string[]) => {
    if (type === PaymentInstruments.creditCards) {
      handleGetCreditCardsApiResponse(res);
      return;
    }
    if (type === PaymentInstruments.bankAccounts) {
      handleGetBankAccountsApiResponse(res);
      return;
    }
  };
  useFetchData(
    getPaymentInstrumentsFromDB,
    type === PaymentInstruments.creditCards
      ? GET_CREDIT_CARDS_FAILURE_MSG
      : GET_BANK_ACCOUNTS_FAILURE_MSG,
    (paymentInstruments: string[]) => {
      setPaymentInstruments(paymentInstruments);
    },
    null,
    handleApiResponse,
    userId,
    type
  );
  const addUserPaymentInstrumentSuccessHandler = (res: {
    paymentInstrumentAdded: string;
  }) => {
    dispatch(addUserPaymentInstrumentAction(type, res.paymentInstrumentAdded));
  };
  const addPaymentInstrumentErrorHandler = (e: string) => {
    console.log(e);
  };
  const { apiCall: addPaymentInstrument, state: addBankAccountApiState } =
    useApi(
      addUserPaymentInstrumentSuccessHandler,
      addPaymentInstrumentErrorHandler
    );
  const deletePaymentInstrumentApiSuccessHandler = (res: {
    paymentInstruments: string[];
  }) => {
    dispatch(setUserPaymentInstrumentsAction(type, res.paymentInstruments));
  };
  // const deleteBankApiErrorHandler = () => {};
  const { apiCall: deletePaymentInstrument, state } = useApi(
    deletePaymentInstrumentApiSuccessHandler
  );

  const addPaymentInstrumentFormSubmitHandler = (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    e.target.reset();
    let paymentInstrumentName = '';
    for (const [key, value] of formData) {
      if (key === 'paymentInstrumentName') {
        paymentInstrumentName = value;
      }
    }
    addPaymentInstrument(() =>
      addPaymentInstrumentDB(userId, type, {
        paymentInstrumentName
      })
    );
  };
  const deletePaymentInstrumentHandler = (
    paymentInstrumentToDelete: string
  ) => {
    const oldPaymentInstruments = [...paymentInstruments];
    let newPaymentInstruments: string[] = [];
    if (oldPaymentInstruments.length === 1) newPaymentInstruments = [];
    else {
      const paymentInstrumentIndexToDelete = oldPaymentInstruments.findIndex(
        (bankAccount) => bankAccount === paymentInstrumentToDelete
      );
      oldPaymentInstruments.splice(paymentInstrumentIndexToDelete, 1);
      newPaymentInstruments = oldPaymentInstruments;
    }

    deletePaymentInstrument(() =>
      deletePaymentInstrumentDB(type, userId, newPaymentInstruments)
    );
  };
  return (
    <div className={styles.bankAccountsPage}>
      <div>
        {type === PaymentInstruments.bankAccounts
          ? 'Bank Accounts'
          : 'Credit Cards'}
      </div>
      <form onSubmit={addPaymentInstrumentFormSubmitHandler}>
        <input type={'text'} name={'paymentInstrumentName'} />
        <button>
          Add{' '}
          {type === PaymentInstruments.bankAccounts
            ? 'bank Account'
            : 'credit card'}
        </button>
      </form>
      {paymentInstruments?.length > 0 &&
        paymentInstruments?.map((bankAccount) => (
          <div key={bankAccount} className={styles.bankRow}>
            <p>{bankAccount}</p>
            <button onClick={() => deletePaymentInstrumentHandler(bankAccount)}>
              Delete
            </button>
          </div>
        ))}
    </div>
  );
};

export default PaymentInstrument;
