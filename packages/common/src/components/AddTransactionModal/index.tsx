import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import Loader from '@moneytracker/common/src/components/Loader';
import TransactionCategoryInput from './TransactionCategoryInput';
import {
  AddTransaction,
  AddTransactionModalProps,
  ILocalStorageAddTransactionState
} from './interface';
import styles from './styles.module.scss';

import {
  addTransactionAction,
  deleteTransactionAction,
  editBankCreditAction,
  editBankDebitAction,
  editCashCreditAction,
  editCashDebitAction,
  editTransactionAction,
  updateStatusAction
} from '@moneytracker/common/src/actions/actionCreator';

import {
  ADD_TRANSACTION_FAIL_ERROR,
  ADD_TRANSACTION_SUCCESS_MSG,
  CASH_MODE,
  CREDIT_TYPE,
  DEBIT_TYPE,
  INVALID_AMOUNT_WARNING,
  INVALID_TITLE_WARNING,
  BORROWED_TYPE,
  ONLINE_MODE,
  SEVERITY_ERROR,
  SEVERITY_SUCCESS,
  SEVERITY_WARNING,
  CATEGORIES_TO_NOT_INCLUDE_IN_SUMMARY,
  TRANSACTION_MODES,
  EDIT_TRANSACTION_SUCCESS_MSG,
  EDIT_TRANSACTION_FAIL_ERROR,
  ADD_TRANSACTION_MODAL_COMPONENT_NAME,
  EDIT_TRANSACTION_MODAL_COMPONENT_NAME,
  DELETE_TRANSACTION_SUCCESS_MSG,
  DELETE_TRANSACTION_FAIL_ERROR
} from '@moneytracker/common/src/Constants';

import {
  addTransactionDB,
  deleteTransactionDB,
  editTransactionDB
} from '@moneytracker/common/src/api-services/api.service';
import useApi from '@moneytracker/common/src/customHooks/useApi';
import { Transaction } from '../../interfaces';
import { constructTodayDate, removeDuplicateFromArray } from '../../utility';
import {
  getPersistedBankAccounts,
  getPersistedCreditCards,
  getPersistedTransactionCategories
} from '../../api-services/utility';

const LATEST_ADD_TRANSACTION_STATE = 'latest_add_transaction_state';
const DEFAULT_PAYMENT_INSTRUMENT = 'HDFC';

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
    return removeDuplicateFromArray([
      ...localStorageLatestCategoriesToDisplay,
      ...categoriesFromDBNotInLatestCategories
    ]);
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
    creditCard: newInput.creditCard,
    date: newInput.date
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
  handleClose,
  transaction: transactionProps,
  buttonName = 'Add',
  renderedByComponentName = ADD_TRANSACTION_MODAL_COMPONENT_NAME
}: AddTransactionModalProps) => {
  const dispatch = useDispatch();
  const isEditTransactionModal =
    renderedByComponentName === EDIT_TRANSACTION_MODAL_COMPONENT_NAME;
  const bankAccounts = getPersistedBankAccounts();
  const creditCards = getPersistedCreditCards();
  const transactionCategories = getPersistedTransactionCategories();
  const paymentInstruments = [...bankAccounts, ...creditCards];
  let categories = transactionCategories?.debit ?? [];

  const localStorageLatestAddTransactionStateString = localStorage.getItem(
    LATEST_ADD_TRANSACTION_STATE
  );
  const localStorageLatestAddTransactionState = {};
  if (localStorageLatestAddTransactionStateString) {
    JSON.parse(localStorageLatestAddTransactionStateString);
  }
  let categoriesToDisplay = getCategoriesToDisplay(categories);
  const getInitialDate = () => {
    try {
      const localStorageLatestAddTransactionStateDate =
        localStorageLatestAddTransactionState?.date;
      if (localStorageLatestAddTransactionState?.date) {
        return constructTodayDate(localStorageLatestAddTransactionStateDate);
      }
      return constructTodayDate();
    } catch (e) {
      return constructTodayDate();
    }
  };
  const getInitialMode = () =>
    localStorageLatestAddTransactionState?.mode ?? ONLINE_MODE;
  const getInitialType = () =>
    localStorageLatestAddTransactionState?.type ?? DEBIT_TYPE;
  const getInitialPaymentInstrument = () =>
    localStorageLatestAddTransactionState?.bankAccount ||
    localStorageLatestAddTransactionState?.creditCard ||
    DEFAULT_PAYMENT_INSTRUMENT;
  const getInitialCategory = () =>
    categoriesToDisplay?.length > 0 ? categoriesToDisplay[0] : '';
  const [transaction, setTransaction] = useState(() => {
    console.log(transactionProps);
    if (transactionProps)
      return {
        ...transactionProps,
        date: constructTodayDate(transactionProps.date),
        selectedPaymentInstrument:
          transactionProps?.bankAccount ||
          transactionProps?.creditCard ||
          DEFAULT_PAYMENT_INSTRUMENT
      };
    return {
      heading: '',
      amount: '',
      date: getInitialDate(),
      mode: getInitialMode(),
      type: getInitialType(),
      selectedPaymentInstrument: getInitialPaymentInstrument(),
      category: getInitialCategory()
    };
  });
  const heading = transaction.heading;
  const amount = transaction.amount;
  const date = transaction.date;
  const mode = transaction.mode;
  const type = transaction.type;
  const selectedPaymentInstrument = transaction?.selectedPaymentInstrument;
  const category = transaction.category;
  console.log(transaction);
  if (type === CREDIT_TYPE) categories = transactionCategories.credit;
  categoriesToDisplay = getCategoriesToDisplay(categories);
  const isMountedRef = useRef(false);
  useEffect(function cleanUp() {
    return function setFieldsEmpty() {
      setTransaction((prev) => ({ ...prev, heading: '', amount: '' }));
    };
  }, []);
  useEffect(
    function updateCategoryOnTypeChange() {
      if (!isMountedRef.current) {
        isMountedRef.current = true;
        return;
      }
      console.log(isMountedRef);
      setTransaction((prev) => ({
        ...prev,
        category: categoriesToDisplay.length > 0 ? categoriesToDisplay[0] : ''
      }));
    },
    [type]
  );
  const addTransactionSuccessHandler = (transactionResponse: Transaction) => {
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
      } else if (
        mode === ONLINE_MODE &&
        CATEGORIES_TO_NOT_INCLUDE_IN_SUMMARY.includes(
          transactionResponse.category
        )
      ) {
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
  const editTransactionSuccessHandler = (transactionResponse: Transaction) => {
    dispatch(
      editTransactionAction(transactionResponse._id, transactionResponse)
    );
    const { type: editedType, mode: editedMode } = transactionResponse;
    const changedAmount = transactionResponse.amount - transaction.amount;
    if (editedType === DEBIT_TYPE) {
      //if changedAmount negative implies less spent, increase in balance
      if (editedMode === CASH_MODE) {
        dispatch(editCashDebitAction(changedAmount));
      } else if (editedMode === ONLINE_MODE) {
        dispatch(editBankDebitAction(changedAmount));
      }
    } else {
      if (editedMode === CASH_MODE) {
        dispatch(editCashCreditAction(changedAmount));
      } else if (editedMode === ONLINE_MODE) {
        dispatch(editBankCreditAction(changedAmount));
      }
    }
    dispatch(
      updateStatusAction({
        showFeedBack: true,
        msg: EDIT_TRANSACTION_SUCCESS_MSG,
        severity: SEVERITY_SUCCESS
      })
    );
  };
  const deleteTransactionSuccessHandler = (res) => {
    const { transactionId } = res;
    if (type === DEBIT_TYPE) {
      if (mode === ONLINE_MODE || mode === undefined) {
        // while deleting edited values should not be taken
        dispatch(editBankDebitAction(-1 * amount));
      } else {
        dispatch(editCashDebitAction(-1 * amount));
      }
    } else {
      if (mode === ONLINE_MODE) {
        dispatch(editBankCreditAction(-1 * amount));
      } else {
        dispatch(editCashCreditAction(-1 * amount));
      }
    }
    dispatch(deleteTransactionAction(transactionId));
    dispatch(
      updateStatusAction({
        showFeedBack: true,
        msg: DELETE_TRANSACTION_SUCCESS_MSG,
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

  const editTransactionApiErrorHandler = (error: any) => {
    console.error(error);
    dispatch(
      updateStatusAction({
        showFeedBack: true,
        msg: EDIT_TRANSACTION_FAIL_ERROR,
        severity: SEVERITY_ERROR
      })
    );
  };
  const deleteTransactionApiErrorHandler = (error: any) => {
    console.error(error);
    dispatch(
      updateStatusAction({
        showFeedBack: true,
        msg: DELETE_TRANSACTION_FAIL_ERROR,
        severity: SEVERITY_ERROR
      })
    );
  };
  const { apiCall: addTransactionApiCall, state: addTransactionState } = useApi(
    addTransactionSuccessHandler,
    addTransactionApiErrorHandler,
    handleClose
  );

  const { apiCall: editTransactionApiCall, state: editTransactionState } =
    useApi(
      editTransactionSuccessHandler,
      editTransactionApiErrorHandler,
      handleClose
    );

  const { apiCall: deleteTransactionApiCall, state: deleteTransactionState } =
    useApi(
      deleteTransactionSuccessHandler,
      deleteTransactionApiErrorHandler,
      handleClose
    );
  const isRadioModeChecked = (value: string) => {
    if (mode === '') return value === ONLINE_MODE;
    return mode === value;
  };
  const handleModeChange = (event: any) => {
    setTransaction((prev) => ({ ...prev, mode: event.target.value }));
  };
  const isRadioTypeChecked = (value: string) => {
    if (type === '') return value === DEBIT_TYPE;
    return type === value;
  };
  const handleTypeChange = (event: any) => {
    setTransaction((prev) => ({ ...prev, type: event.target.value }));
  };
  const handleHeadingChange = (event: any) => {
    setTransaction((prev) => ({ ...prev, heading: event.target.value }));
  };
  const handleAmountChange = (event: any) => {
    setTransaction((prev) => ({ ...prev, amount: event.target.value }));
  };
  const handleDateChange = (event: any) => {
    setTransaction((prev) => ({ ...prev, date: event.target.value }));
  };
  const handleCategoryChange = (category: string) => {
    setTransaction((prev) => ({ ...prev, category: category }));
  };
  const handleTransactionSubmit = async (event: any) => {
    event.preventDefault();
    console.log(amount);
    if (amount === '' || parseInt(amount) <= 0 || heading === '') {
      console.log('hi');
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
      bankAccount: type !== BORROWED_TYPE ? selectedPaymentInstrument : '',
      creditCard: type === BORROWED_TYPE ? selectedPaymentInstrument : '',
      type,
      category
    };
    if (renderedByComponentName === EDIT_TRANSACTION_MODAL_COMPONENT_NAME) {
      editTransactionApiCall(() =>
        editTransactionDB(transactionProps._id, transaction)
      );
      return;
    }
    addTransactionApiCall(() => addTransactionDB(transaction));
  };
  const handleDeleteTransactionClick = () => {
    deleteTransactionApiCall(() => deleteTransactionDB(transaction._id));
  };
  const showFormSubmitLoader =
    addTransactionState.loading || editTransactionState.loading;
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
            renderedByComponentName={renderedByComponentName}
          />
          {/* Mode */}
          <div className={styles.fieldSet}>
            <div className={styles.fieldSetLabel}>Mode</div>
            {/* Mode radio group */}
            <div className={styles.radioGroupWrapper}>
              {TRANSACTION_MODES.map((transactionMode) => {
                return (
                  <div key={transactionMode}>
                    <input
                      type="radio"
                      name="transactionMode"
                      id={transactionMode}
                      value={transactionMode.toLowerCase()}
                      checked={isRadioModeChecked(
                        transactionMode.toLowerCase()
                      )}
                      onChange={handleModeChange}
                    />
                    <label htmlFor={transactionMode}>{transactionMode}</label>
                  </div>
                );
              })}
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
                          setTransaction((prev) => ({
                            ...prev,
                            selectedPaymentInstrument: e.target.value
                          }))
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
              defaultValue={date}
              onChange={handleDateChange}
            />
          </div>
          <div className={styles.buttonWrapper}>
            {isEditTransactionModal ? (
              deleteTransactionState.loading ? (
                <Loader />
              ) : (
                <button
                  // why type="button" added https://github.com/redux-form/redux-form/issues/2679#issuecomment-286153902
                  type="button"
                  className={styles.button}
                  onClick={handleDeleteTransactionClick}
                >
                  Delete
                </button>
              )
            ) : (
              <button
                // why type="button" added https://github.com/redux-form/redux-form/issues/2679#issuecomment-286153902
                type="button"
                className={styles.button}
                onClick={handleClose}
              >
                Close
              </button>
            )}
            {showFormSubmitLoader ? (
              <Loader />
            ) : (
              <input
                type="submit"
                className={styles.button}
                value={buttonName}
              />
            )}
          </div>
        </form>
      </div>
    </Dialog>
  );
};

export default AddTransactionModal;
