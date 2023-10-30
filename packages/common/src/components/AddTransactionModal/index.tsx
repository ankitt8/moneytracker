import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LinearProgress from '@material-ui/core/LinearProgress';
import Dialog from '@material-ui/core/Dialog';
import Loader from '@moneytracker/common/src/components/Loader';
import TransactionCategoryInput from './TransactionCategoryInput';
import { AddTransaction, AddTransactionModalProps } from './interface';
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

const MOST_RECENT_TRANSACTION_CATEGORIES = 'most-recent-transaction-categories';
const DEFAULT_PAYMENT_INSTRUMENT = 'HDFC';
const AddTransactionModal = ({
  userId,
  handleClose
}: AddTransactionModalProps) => {
  const dispatch = useDispatch();
  const [heading, setHeading] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(constructTodayDate());

  const [mode, setMode] = useState(ONLINE_MODE);
  const [selectedPaymentInstrument, setSelectedPaymentInstrument] = useState(
    DEFAULT_PAYMENT_INSTRUMENT
  );
  const [type, setType] = useState(DEBIT_TYPE);
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

  const mostRecentCategories = getMostRecentCategories(categories, type);
  const [category, setCategory] = useState(() =>
    mostRecentCategories.length > 0 ? mostRecentCategories[0] : ''
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
    setCategory(mostRecentCategories.length > 0 ? mostRecentCategories[0] : '');
  }, [type]);
  const addTransactionSuccessHandler = (transactionResponse: Transaction) => {
    const localStorageMostRecentTransactionCategories = localStorage.getItem(
      MOST_RECENT_TRANSACTION_CATEGORIES
    );
    let mostRecentCategoriesLocalStorage: {
      category: string;
      type: string;
    }[] = [];
    if (localStorageMostRecentTransactionCategories) {
      mostRecentCategoriesLocalStorage = JSON.parse(
        localStorageMostRecentTransactionCategories
      );
    }
    const MOST_RECENT_CATEGORIES_NUM = 10;
    if (!mostRecentCategoriesLocalStorage) {
      localStorage.setItem(
        MOST_RECENT_TRANSACTION_CATEGORIES,
        JSON.stringify([{ category, type }])
      );
    }
    if (mostRecentCategoriesLocalStorage) {
      if (
        mostRecentCategoriesLocalStorage.length < MOST_RECENT_CATEGORIES_NUM
      ) {
        localStorage.setItem(
          MOST_RECENT_TRANSACTION_CATEGORIES,
          JSON.stringify([
            { category, type },
            ...mostRecentCategoriesLocalStorage.filter(
              (categoryLocalStorage) =>
                categoryLocalStorage?.category !== category
            )
          ])
        );
      } else {
        const newMostRecentCategoriesLocalStorage = [];
        for (let i = 1; i < MOST_RECENT_CATEGORIES_NUM; i++) {
          newMostRecentCategoriesLocalStorage.push(
            mostRecentCategoriesLocalStorage[i]
          );
        }
        newMostRecentCategoriesLocalStorage[0] = {
          category,
          type
        };
        localStorage.setItem(
          MOST_RECENT_TRANSACTION_CATEGORIES,
          JSON.stringify(newMostRecentCategoriesLocalStorage)
        );
      }
    }
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
            categories={mostRecentCategories || []}
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

function getMostRecentCategories(categoriesFromDB: string[], type: string) {
  try {
    const localStorageMostRecentTransactionCategories = localStorage.getItem(
      MOST_RECENT_TRANSACTION_CATEGORIES
    );
    let mostRecentCategoriesLocalStorage: { category: string; type: string }[] =
      [];
    if (localStorageMostRecentTransactionCategories) {
      mostRecentCategoriesLocalStorage = JSON.parse(
        localStorageMostRecentTransactionCategories
      );
    }
    const mostRecentCategoriesLocalStorageFilteredByType =
      mostRecentCategoriesLocalStorage
        .filter((mostRecentCategoryLocalStorage) => {
          return mostRecentCategoryLocalStorage?.type === type;
        })
        .map((categoryLocalStorage) => categoryLocalStorage?.category);
    // don't show the category from db which is in mostRecentCategoriesLocalStorage
    // DB = database

    let mostRecentCategories: string[];
    if (
      mostRecentCategoriesLocalStorageFilteredByType &&
      mostRecentCategoriesLocalStorageFilteredByType.length > 0
    ) {
      const categoriesFromDBNotInMostRecentCategories = categoriesFromDB.filter(
        (categoryFromDB) => {
          return !mostRecentCategoriesLocalStorageFilteredByType.includes(
            categoryFromDB
          );
        }
      );
      mostRecentCategories = [
        ...mostRecentCategoriesLocalStorageFilteredByType,
        ...categoriesFromDBNotInMostRecentCategories
      ];
    } else {
      mostRecentCategories = categoriesFromDB;
    }
    return mostRecentCategories;
  } catch (e) {
    return categoriesFromDB;
  }
}
export default AddTransactionModal;
