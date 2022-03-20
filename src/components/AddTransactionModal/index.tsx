import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LinearProgress from '@material-ui/core/LinearProgress';
import Dialog from '@material-ui/core/Dialog';
import Loader from 'components/Loader';
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
} from 'actions/actionCreator';

import {
  ADD_TRANSACTION_FAIL_ERROR,
  ADD_TRANSACTION_SUCCESS_MSG,
  CASH_MODE,
  CREDIT_TYPE,
  DEBIT_TYPE,
  GET_TRANSACTION_CATEGORIES_FAILURE_MSG,
  INVALID_AMOUNT_WARNING,
  INVALID_TITLE_WARNING,
  ONLINE_MODE,
  SEVERITY_ERROR,
  SEVERITY_SUCCESS,
  SEVERITY_WARNING
} from 'Constants';

import {
  addTransactionDB,
  getTransactionCategoriesFromDB,
  getTransactionsFromDB
} from 'api-services/api.service';
import { ReduxStore } from 'reducers/interface';
import useFetchData from 'customHooks/useFetchData';
import { FETCH_STATES } from 'reducers/DataReducer';

const AddTransactionModal = ({
  userId,
  handleClose
}: AddTransactionModalProps) => {
  const dispatch = useDispatch();
  const [heading, setHeading] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(constructTodayDate());
  const [category, setCategory] = useState('');
  const [loadingState, setLoadingState] = useState(false);
  const [mode, setMode] = useState(ONLINE_MODE);
  const [type, setType] = useState(DEBIT_TYPE);
  const state = useFetchData(
    getTransactionCategoriesFromDB,
    GET_TRANSACTION_CATEGORIES_FAILURE_MSG,
    getTransactionCategories,
    userId
  );
  const transactionCategories = useSelector(
    (store: ReduxStore) => store.transactions.categories
  );
  const categories =
    type === DEBIT_TYPE
      ? transactionCategories.debit
      : transactionCategories.credit;

  useEffect(() => {
    return function setFieldsEmpty() {
      setHeading('');
      setAmount('');
      setDate(constructTodayDate());
      setCategory('');
      setLoadingState(false);
    };
  }, []);
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
    console.log(event.target.value);
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
    setLoadingState(true);
    const transaction: AddTransaction = {
      userId,
      heading,
      amount: parseInt(amount),
      date: new Date(date),
      mode,
      type,
      category
    };
    try {
      const transactionObjectStored = await addTransactionDB(transaction);
      dispatch(addTransactionAction(transactionObjectStored));
      const { amount, mode } = transactionObjectStored;
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
    } catch (error) {
      console.error(error);
      dispatch(
        updateStatusAction({
          showFeedBack: true,
          msg: ADD_TRANSACTION_FAIL_ERROR,
          severity: SEVERITY_ERROR
        })
      );
    } finally {
      handleClose();
    }
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
      {state.fetching === FETCH_STATES.PENDING && <LinearProgress />}
      <div className={styles.modalWrapper}>
        <h3 className={styles.modalTitle}>Add Transaction</h3>
        <form onSubmit={handleTransactionSubmit}>
          {/* Categories */}
          <TransactionCategoryInput
            categories={categories}
            categorySelected={category}
            handleCategoryChange={handleCategoryChange}
          />
          {/* Mode */}
          <div className={styles.fieldSet}>
            <div className={styles.fieldSetLabel}>Mode</div>
            {/* Mode radio group */}
            <div className={styles.radioGroupWrapper}>
              <div className={styles.radio}>
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
              <div className={styles.radio}>
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
          {/* Type */}
          <div className={styles.fieldSet}>
            <div className={styles.fieldSetLabel}>Type</div>
            {/* Type radio group */}
            <div className={styles.radioGroupWrapper}>
              <div className={styles.radio}>
                <input
                  type="radio"
                  name="transactionType"
                  id="credittype"
                  value={CREDIT_TYPE}
                  checked={isRadioTypeChecked('credit')}
                  onChange={handleTypeChange}
                />
                <label htmlFor="credittype">Credit</label>
              </div>
              <div className={styles.radio}>
                <input
                  type="radio"
                  name="transactionType"
                  id="debittype"
                  value={DEBIT_TYPE}
                  checked={isRadioTypeChecked('debit')}
                  onChange={handleTypeChange}
                />
                <label htmlFor="debittype">Debit</label>
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
            {loadingState ? (
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

export default AddTransactionModal;
