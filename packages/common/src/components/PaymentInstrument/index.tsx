import styles from './styles.module.scss';
import useApi from '@moneytracker/common/src/customHooks/useApi';
import {
  addPaymentInstrumentDB,
  deletePaymentInstrumentDB,
  getPaymentInstrumentsFromDB
} from '../../api-services/api.service';
import useFetchData from '../../customHooks/useFetchData';
import { GET_BANK_ACCOUNTS_FAILURE_MSG } from '../../Constants';
import {
  addUserPaymentInstrumentAction,
  setUserPaymentInstrumentsAction
} from '../../actions/actionCreator';
import { useDispatch, useSelector } from 'react-redux';
import { ReduxStore } from '../../reducers/interface';
import { PaymentInstruments } from '../../interfaces';

interface IPaymentInstrument {
  userId: string;
  type: PaymentInstruments.bankAccounts | PaymentInstruments.creditCards;
}
const PaymentInstrument = ({ userId, type }: IPaymentInstrument) => {
  const dispatch = useDispatch();
  const paymentInstruments = useSelector((store: ReduxStore) =>
    type === PaymentInstruments.bankAccounts
      ? store.user.bankAccounts
      : store.user.creditCards
  );
  // for(const bankAccount of bankAccounts) {
  //   console.log(bankAccount);
  // }
  useFetchData(
    getPaymentInstrumentsFromDB,
    GET_BANK_ACCOUNTS_FAILURE_MSG,
    (paymentInstruments: string[]) =>
      setUserPaymentInstrumentsAction(type, paymentInstruments),
    null,
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
