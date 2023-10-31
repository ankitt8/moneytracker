import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LinearProgress from '@material-ui/core/LinearProgress';
import Dialog from '@material-ui/core/Dialog';
import Loader from '@moneytracker/common/src/components/Loader';
import TransactionCategoryInput from './TransactionCategoryInput';
import {
  AddTransaction,
  AddTransactionModalProps,
  ILocalStorageAddTransactionState,
  IUpdateLatestTransactionCategoriesLocalStorage
} from './interface';
import styles from './styles.module.scss';

import {
  addTransactionAction,
  editBankCreditAction,
  editBankDebitAction,
  editCashCreditAction,
  editCashDebitAction,
  getTransactionCategories,
  updateStatusAction
} from '@moneytracker/common/src/actions/actionCreator';

import {
  ADD_TRANSACTION_FAIL_ERROR,
  ADD_TRANSACTION_SUCCESS_MSG,
  CASH_MODE,
  CREDIT_TYPE,
  DEBIT_TYPE,
  GET_TRANSACTION_CATEGORIES_FAILURE_MSG,
  INVALID_AMOUNT_WARNING,
  INVALID_TITLE_WARNING,
  BORROWED_TYPE,
  ONLINE_MODE,
  SEVERITY_ERROR,
  SEVERITY_SUCCESS,
  SEVERITY_WARNING
} from '@moneytracker/common/src/Constants';

import { addTransactionDB } from '@moneytracker/common/src/api-services/api.service';
import { ReduxStore } from '@moneytracker/common/src/reducers/interface';
import useApi from '@moneytracker/common/src/customHooks/useApi';
import { Transaction } from '../../interfaces';
import { ITransactions } from '../Transactions/interface';

const LATEST_ADD_TRANSACTION_STATE = 'latest_add_transaction_state';
const DEFAULT_PAYMENT_INSTRUMENT = 'HDFC';

function constructTodayDate(): string {
  const todayDate = new Date();
  const appendYear = (str: string) => str + todayDate.getFullYear().toString();
  const appendMonth = (str: string) => {
    const month = todayDate.getMonth();
    const result = month + 1 < 10 ? `0${month + 1}` : `${month + 1}`;
    return str + result;
  };
  const appendSeperator = (str: string) => str + '-';
  const appendDate = (str: string) => {
    const date = todayDate.getDate();
    const result = date < 10 ? `0${date}` : date.toString();
    return str + result;
  };
  const pipe =
    (...fns: ((str: string) => any)[]) =>
    (x: string) =>
      fns.reduce((currVal, currFunc) => currFunc(currVal), x);
  return pipe(
    appendYear,
    appendSeperator,
    appendMonth,
    appendSeperator,
    appendDate
  )('');
}

function getCategoriesToDisplay(categoriesFromDB: string[]) {
  try {
    const localStorageLatestAddTransactionStateString = localStorage.getItem(
      LATEST_ADD_TRANSACTION_STATE
    );
    if (!localStorageLatestAddTransactionStateString) return categoriesFromDB;
    let localStorageLatestAddTransactionState: ILocalStorageAddTransactionState =
      {};
    localStorageLatestAddTransactionState = JSON.parse(
      localStorageLatestAddTransactionStateString
    );
    const localStorageLatestCategoriesToDisplay =
      localStorageLatestAddTransactionState.categories;
    const categoriesFromDBNotInLatestCategories = categoriesFromDB.filter(
      (categoryFromDB) => {
        return !localStorageLatestCategoriesToDisplay.includes(categoryFromDB);
      }
    );
    return [
      ...localStorageLatestCategoriesToDisplay,
      ...categoriesFromDBNotInLatestCategories
    ];
  } catch (e) {
    return categoriesFromDB;
  }
}
function getLocalStorageAddTransactionStateToStore(
  newInput: Transaction
): ILocalStorageAddTransactionState {
  return {
    categories: [newInput.category],
    mode: newInput.mode,
    type: newInput.type,
    bankAccount: newInput.bankAccount,
    creditCard: newInput.creditCard
  };
}
function updateLatestTransactionCategoriesLocalStorage(newInput: Transaction) {
  // ls implies LocalStorage
  const localStorageLatestAddTransactionStateString = localStorage.getItem(
    LATEST_ADD_TRANSACTION_STATE
  );
  const newLocalStorageAddTransactionState =
    getLocalStorageAddTransactionStateToStore(newInput);
  if (!localStorageLatestAddTransactionStateString) {
    localStorage.setItem(
      LATEST_ADD_TRANSACTION_STATE,
      JSON.stringify(newLocalStorageAddTransactionState)
    );
    return;
  }
  let localStorageLatestAddTransactionState: ILocalStorageAddTransactionState =
    {};
  if (localStorageLatestAddTransactionStateString) {
    localStorageLatestAddTransactionState = JSON.parse(
      localStorageLatestAddTransactionStateString
    );
  }
  const LATEST_CATEGORIES_LIMIT = 10;

  const isLatestCategoriesLocalStorageLimitReached =
    localStorageLatestAddTransactionState.categories.length >=
    LATEST_CATEGORIES_LIMIT;
  if (isLatestCategoriesLocalStorageLimitReached) {
    const newLatestCategoriesLocalStorage = [
      newInput.category,
      ...localStorageLatestAddTransactionState.categories.slice(1)
    ];
    localStorage.setItem(
      LATEST_ADD_TRANSACTION_STATE,
      JSON.stringify({
        ...newLocalStorageAddTransactionState,
        categories: newLatestCategoriesLocalStorage
      })
    );
    return;
  }
  localStorage.setItem(
    LATEST_ADD_TRANSACTION_STATE,
    JSON.stringify({
      ...newLocalStorageAddTransactionState,
      categories: [
        newInput.category,
        ...localStorageLatestAddTransactionState.categories.filter(
          (categoryLocalStorage) => categoryLocalStorage !== newInput.category
        )
      ]
    })
  );
}

const AddTransactionModal = ({
  userId,
  handleClose
}: AddTransactionModalProps) => {
  const dispatch = useDispatch();
  const [heading, setHeading] = useState('');
  const [amount, setAmount] = useState('');
  const localStorageLatestAddTransactionStateString = localStorage.getItem(
    LATEST_ADD_TRANSACTION_STATE
  );
  const localStorageLatestAddTransactionState = JSON.parse(
    localStorageLatestAddTransactionStateString
  );
  const [date, setDate] = useState(constructTodayDate());

  const [mode, setMode] = useState(() => {
    return localStorageLatestAddTransactionState?.mode ?? ONLINE_MODE;
  });
  const [selectedPaymentInstrument, setSelectedPaymentInstrument] = useState(
    () =>
      localStorageLatestAddTransactionState?.bankAccount ||
      localStorageLatestAddTransactionState?.creditCard ||
      DEFAULT_PAYMENT_INSTRUMENT
  );
  const [type, setType] = useState(
    () => localStorageLatestAddTransactionState?.type ?? DEBIT_TYPE
  );
  const transactionCategories = useSelector(
    (store: ReduxStore) => store.transactions.categories
  );
  const bankAccounts = useSelector(
    (store: ReduxStore) => store.user.bankAccounts
  );
  const creditCards = useSelector(
    (store: ReduxStore) => store.user.creditCards
  );
  const paymentInstruments = [...bankAccounts, ...creditCards];
  let categories = transactionCategories.debit;
  if (type === CREDIT_TYPE) categories = transactionCategories.credit;

  const categoriesToDisplay = getCategoriesToDisplay(categories, type);
  const [category, setCategory] = useState(() =>
    categoriesToDisplay.length > 0 ? categoriesToDisplay[0] : ''
  );
  useEffect(() => {
    return function setFieldsEmpty() {
      setHeading('');
      setAmount('');
      setDate(constructTodayDate());
      setCategory('');
    };
  }, []);
  useEffect(() => {
    setCategory(categoriesToDisplay.length > 0 ? categoriesToDisplay[0] : '');
  }, [type]);
  const addTransactionSuccessHandler = (transactionResponse: Transaction) => {
    console.log(transactionResponse);
    updateLatestTransactionCategoriesLocalStorage(transactionResponse);
    dispatch(addTransactionAction(transactionResponse));
    const { amount, mode } = transactionResponse;
    if (type === DEBIT_TYPE) {
      if (mode === CASH_MODE) {
        dispatch(editCashDebitAction(amount));
      } else if (mode === ONLINE_MODE) {
        dispatch(editBankDebitAction(amount));
      }
    } else {
      if (mode === CASH_MODE) {
        dispatch(editCashCreditAction(amount));
      } else if (mode === ONLINE_MODE) {
        dispatch(editBankCreditAction(amount));
      }
    }
    dispatch(
      updateStatusAction({
        showFeedBack: true,
        msg: ADD_TRANSACTION_SUCCESS_MSG,
        severity: SEVERITY_SUCCESS
      })
    );
  };
  const addTransactionApiErrorHandler = (error: any) => {
    console.error(error);
    dispatch(
      updateStatusAction({
        showFeedBack: true,
        msg: ADD_TRANSACTION_FAIL_ERROR,
        severity: SEVERITY_ERROR
      })
    );
  };
  const { apiCall: addTransactionApiCall, state } = useApi(
    addTransactionSuccessHandler,
    addTransactionApiErrorHandler,
    handleClose
  );
  const isRadioModeChecked = (value: string) => {
    if (mode === '') return value === ONLINE_MODE;
    return mode === value;
  };
  const handleModeChange = (event: any) => {
    setMode(event.target.value);
  };
  const isRadioTypeChecked = (value: string) => {
    if (type === '') return value === DEBIT_TYPE;
    return type === value;
  };
  const handleTypeChange = (event: any) => {
    setType(event.target.value);
  };
  const handleHeadingChange = (event: any) => {
    setHeading(event.target.value);
  };
  const handleAmountChange = (event: any) => {
    setAmount(event.target.value);
  };
  const handleDateChange = (event: any) => {
    setDate(event.target.value);
  };
  const handleCategoryChange = (category: string) => {
    setCategory(category);
  };
  const handleTransactionSubmit = async (event: any) => {
    event.preventDefault();
    if (amount === '' || parseInt(amount) <= 0 || heading === '') {
      const msg =
        heading === '' ? INVALID_TITLE_WARNING : INVALID_AMOUNT_WARNING;
      dispatch(
        updateStatusAction({
          showFeedBack: true,
          msg,
          severity: SEVERITY_WARNING
        })
      );
      return;
    }
    const transaction: AddTransaction = {
      userId,
      heading,
      amount: parseInt(amount),
      date: new Date(date),
      mode,
      bankAccount: type === DEBIT_TYPE ? selectedPaymentInstrument : '',
      creditCard: type === BORROWED_TYPE ? selectedPaymentInstrument : '',
      type,
      category
    };
    addTransactionApiCall(() => addTransactionDB(transaction));
  };
  return (
    <Dialog
      maxWidth={'sm'}
      open={true}
      // if I add transition and change the categories then whole modal appears again from bottom
      // TransitionComponent={Transition}
      onClose={handleClose}
      aria-labelledby="max-width-dialog-heading"
    >
      {/*{fetchStatus.fetching === FETCH_STATES.PENDING && <LinearProgress />}*/}
      <div className={styles.modalWrapper}>
        <h3 className={styles.modalTitle}>Add Transaction</h3>
        <form onSubmit={handleTransactionSubmit}>
          {/* Categories */}
          <TransactionCategoryInput
            categories={categoriesToDisplay || []}
            categorySelected={category}
            handleCategoryChange={handleCategoryChange}
          />
          {/* Mode */}
          <div className={styles.fieldSet}>
            <div className={styles.fieldSetLabel}>Mode</div>
            {/* Mode radio group */}
            <div className={styles.radioGroupWrapper}>
              <div>
                <input
                  type="radio"
                  name="transactionMode"
                  id="bankmode"
                  value={ONLINE_MODE}
                  checked={isRadioModeChecked('online')}
                  onChange={handleModeChange}
                />
                <label htmlFor="bankmode">Bank</label>
              </div>
              <div>
                <input
                  type="radio"
                  name="transactionMode"
                  id="cashmode"
                  value={CASH_MODE}
                  checked={isRadioModeChecked('cash')}
                  onChange={handleModeChange}
                />
                <label htmlFor="cashmode">Cash</label>
              </div>
            </div>
          </div>
          {/*BANK ACCOUNT */}
          {mode === ONLINE_MODE ? (
            <div className={styles.fieldSet}>
              <div className={styles.fieldSetLabel}>Payment Instrument</div>
              <div className={styles.radioGroupWrapper}>
                {paymentInstruments?.length > 0 &&
                  paymentInstruments.map((paymentInstrument) => (
                    <div key={paymentInstrument}>
                      <input
                        type="radio"
                        name="transactionInstrument"
                        id={paymentInstrument}
                        value={paymentInstrument}
                        checked={
                          paymentInstrument === selectedPaymentInstrument
                        }
                        onChange={(e) =>
                          setSelectedPaymentInstrument(e.target.value)
                        }
                      />
                      <label htmlFor={paymentInstrument}>
                        {paymentInstrument}
                      </label>
                    </div>
                  ))}
              </div>
            </div>
          ) : null}
          {/* Type */}
          <div className={styles.fieldSet}>
            <div className={styles.fieldSetLabel}>Type</div>
            {/* Type radio group */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div className={styles.radioGroupWrapper}>
                <div>
                  <input
                    type="radio"
                    name="transactionType"
                    id="credittype"
                    value={CREDIT_TYPE}
                    checked={isRadioTypeChecked(CREDIT_TYPE)}
                    onChange={handleTypeChange}
                  />
                  <label htmlFor="credittype">Credit</label>
                </div>
                <div>
                  <input
                    type="radio"
                    name="transactionType"
                    id="debittype"
                    value={DEBIT_TYPE}
                    checked={isRadioTypeChecked(DEBIT_TYPE)}
                    onChange={handleTypeChange}
                  />
                  <label htmlFor="debittype">Debit</label>
                </div>
                <div>
                  <input
                    type="radio"
                    name="transactionType"
                    id="borrowedtype"
                    value={BORROWED_TYPE}
                    checked={isRadioTypeChecked(BORROWED_TYPE)}
                    onChange={handleTypeChange}
                  />
                  <label htmlFor="borrowedtype">Borrowed</label>
                </div>
              </div>
            </div>
          </div>
          {/* Amount */}
          <div className={styles.fieldSet}>
            <div className={styles.fieldSetLabel}>Amount</div>
            <input type="number" value={amount} onChange={handleAmountChange} />
          </div>
          {/* Title */}
          <div className={styles.fieldSet}>
            <div className={styles.fieldSetLabel}>Title</div>
            <input type="text" value={heading} onChange={handleHeadingChange} />
          </div>
          {/* Date */}
          <div className={styles.fieldSet}>
            <div className={styles.fieldSetLabel}>Date</div>
            <input
              type="date"
              id="transactionDate"
              defaultValue={constructTodayDate()}
              onChange={handleDateChange}
            />
          </div>
          <div className={styles.buttonWrapper}>
            <button
              // why type="button" added https://github.com/redux-form/redux-form/issues/2679#issuecomment-286153902
              type="button"
              className={styles.button}
              onClick={handleClose}
            >
              Close
            </button>
            {state.loading ? (
              <Loader />
            ) : (
              <input type="submit" className={styles.button} value="Add" />
            )}
          </div>
        </form>
      </div>
    </Dialog>
  );
};

export default AddTransactionModal;
