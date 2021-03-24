import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Loader from 'components/Loader';
import CategoryInput from './CategoryInput'
import { KeyboardDatePicker } from '@material-ui/pickers';
import { AddTransactionInterface, AddTransactionModalProps } from './interface';

import styles from './styles.module.scss';

import {
  addTransactionAction,
  editBankCreditAction,
  editBankDebitAction,
  editCashCreditAction,
  editCashDebitAction,
  getTransactionCategories,
  updateStatusAction
} from 'actions/actionCreator'

import {
  ADD_TRANSACTION_FAIL_ERROR,
  ADD_TRANSACTION_SUCCESS_MSG,
  CASH_MODE,
  DEBIT_TYPE,
  INVALID_AMOUNT_WARNING,
  INVALID_TITLE_WARNING,
  ONLINE_MODE,
  SEVERITY_ERROR,
  SEVERITY_SUCCESS,
  SEVERITY_WARNING,
} from 'Constants';

import { addTransactionDB, getTransactionCategoriesFromDB } from 'helper';
import { TransactionCategory } from './CategoryInput/interface';

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  modalTitle,
  userId,
  type,
  mode,
  handleClose,
}) => {
  const dispatch = useDispatch();
  const [heading, setHeading] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [category, setCategory] = useState('');
  const [loadingState, setLoadingState] = useState(false);
  // @ts-ignore
  const transactionCategories = useSelector((state) => state.transactions.categories);
  let categories: string[];

  if (type === DEBIT_TYPE) {
    categories = transactionCategories.debit;
  } else {
    categories = transactionCategories.credit;
  }
  const checkTransactionCategoriesChanged = (data: TransactionCategory) => {
    const { credit, debit } = transactionCategories;
    const { credit: dbCredit, debit: dbDebit } = data;
    if (credit.length !== dbCredit.length) return true;
    if (debit.length !== dbDebit.length) return true;
    return false;
  }

  const loadTransactionCategories = useCallback(() => {
    getTransactionCategoriesFromDB(userId)
      .then(({ transactionCategories: dbTransactionCategories }) => {
        if (checkTransactionCategoriesChanged(dbTransactionCategories)) {
          dispatch(getTransactionCategories(dbTransactionCategories));
        }
      });
  }, [])

  useEffect(() => {
    loadTransactionCategories();
    return function setFieldsEmpty() {
      // console.log('cleanup called add transaction modal');
      setHeading('');
      setAmount('');
      setDate(new Date());
      setCategory('');
      setLoadingState(false);
    }
  }, []);

  const handleHeadingChange = (event: any) => {
    setHeading(event.target.value);
  }
  const handleAmountChange = (event: any) => {
    setAmount(event.target.value);
  }
  const handleDateChange = (value: any) => {
    setDate(new Date(value));
  }
  const handleCategoryChange = (category: string) => {
    setCategory(category);
  }

  function handleTransactionSubmit() {
    if (amount === '' || parseInt(amount) <= 0 || heading === '') {
      const msg = (heading === '' ? INVALID_TITLE_WARNING : INVALID_AMOUNT_WARNING);
      dispatch(updateStatusAction({
        showFeedback: true,
        msg,
        severity: SEVERITY_WARNING
      }))
      return;
    }

    setLoadingState(true);

    const transaction: AddTransactionInterface = {
      userId,
      heading,
      amount: parseInt(amount),
      date,
      mode,
      type,
      category,
    };

    addTransactionDB(transaction)
      .then(function onFulfilled(transactionObject) {
        dispatch(addTransactionAction(transactionObject));
        const { amount, mode } = transactionObject;
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
        dispatch(updateStatusAction({
          showFeedback: true,
          msg: ADD_TRANSACTION_SUCCESS_MSG,
          severity: SEVERITY_SUCCESS
        }));
      })
      .catch(function onRejected(error) {
        console.error(error);
        dispatch(updateStatusAction({
          showFeedback: true,
          msg: ADD_TRANSACTION_FAIL_ERROR,
          severity: SEVERITY_ERROR
        }));
      })
      .finally(handleClose);
  }

  return (
    <Dialog
      maxWidth={'sm'}
      open={true}
      onClose={handleClose}
      aria-labelledby="max-width-dialog-heading"
    >
      <DialogTitle id="max-width-dialog-heading">{modalTitle}</DialogTitle>
      <DialogContent>
        <form noValidate autoComplete="off">
          <CategoryInput
            categories={categories}
            categorySelected={category}
            handleCategoryChange={handleCategoryChange}
          />
          <FormControl>
            <InputLabel htmlFor="amount">Amount</InputLabel>
            <Input type="number" id="amount" value={amount} onChange={handleAmountChange} />
          </FormControl>
          <FormControl>
            <InputLabel htmlFor="heading">Title</InputLabel>
            <Input id="heading" value={heading} onChange={handleHeadingChange} />
          </FormControl>
          <FormControl>
            <KeyboardDatePicker
              style={{ marginTop: 20 }}
              required
              autoOk
              variant="inline"
              inputVariant="standard"
              format="dd/MM/yyyy"
              value={date}
              InputAdornmentProps={{ position: 'start' }}
              onChange={(value) => handleDateChange(value)}
            />
          </FormControl>
        </form>
        <div className={styles.buttonWrapper}>
          <button
            className={styles.button}
            onClick={handleClose}
          >
            Close
          </button>
          {
            loadingState ? <Loader /> :
              <button
                className={styles.button}
                onClick={handleTransactionSubmit}
              >
                Add
              </button>
          }
        </div>
      </DialogContent>
    </Dialog>
  )
};

export default AddTransactionModal;