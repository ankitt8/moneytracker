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
  CREDIT_TYPE,
  DEBIT_TYPE,
  INVALID_AMOUNT_WARNING,
  INVALID_TITLE_WARNING,
  ONLINE_MODE,
  SEVERITY_ERROR,
  SEVERITY_SUCCESS,
  SEVERITY_WARNING,
} from 'Constants';

import { addTransactionDB, getTransactionCategoriesFromDB } from 'helper';
import { TransactionCategories } from './CategoryInput/interface';
import Slide from '@material-ui/core/Slide';
import { FormLabel, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  userId,
  handleClose,
}) => {
  const dispatch = useDispatch();
  const [heading, setHeading] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [category, setCategory] = useState('');
  const [loadingState, setLoadingState] = useState(false);
  const [mode, setMode] = React.useState('online');
  const [type, setType] = React.useState('debit');
  const handleModeChange = (event: any) => {
    setMode(event.target.value);
  }
  const handleTypeChange = (event: any) => {
    setType(event.target.value);
  }
  // @ts-ignore
  const Transition = React.forwardRef(function Transition(props, ref) {
    // @ts-ignore
    return <Slide direction="up" ref={ref} {...props} />;
  });
  // @ts-ignore
  const transactionCategories = useSelector((state) => state.transactions.categories);
  let categories: string[];

  if (type === DEBIT_TYPE) {
    categories = transactionCategories.debit;
  } else {
    categories = transactionCategories.credit;
  }
  const checkTransactionCategoriesChanged = (data: TransactionCategories) => {
    // data is of redux store transactionCategories
    const { credit, debit } = transactionCategories;
    // db implies database
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
      // @ts-ignore
      TransitionComponent={Transition}
      onClose={handleClose}
      aria-labelledby="max-width-dialog-heading"
    >

      <div className={styles.modalWrapper}>
        <h3 className={styles.modalTitle}>Add Transaction</h3>
        <form noValidate autoComplete="off">
          <CategoryInput
            categories={categories}
            categorySelected={category}
            handleCategoryChange={handleCategoryChange}
          />
          <div className={styles.fieldSet}>
            <div className={styles.fieldSetLabel}>Mode</div>
            <div className={styles.radioGroupWrapper}>
              <div className={styles.radio}>
                <input type="radio" name="transactionMode" id="bankmode" value="Bank" onChange={handleModeChange} />
                <label htmlFor="bankmode">Bank</label>
              </div>
              <div className={styles.radio}>
                <input type="radio" name="transactionMode" id="cashmode" value="Cash" onChange={handleModeChange} />
                <label htmlFor="cashmode">Cash</label>
              </div>
            </div>
          </div>
          {/* <FormControl component="fieldset" style={{ marginTop: '20px' }}>
              <FormLabel component="legend">Mode</FormLabel>
              <RadioGroup
                aria-label="Mode"
                name="mode"
                value={mode}
                onChange={handleModeChange}
                style={{ flexDirection: 'row' }}
              >
                <FormControlLabel
                  value={ONLINE_MODE}
                  control={<Radio color="primary" />}
                  label="Bank"
                />
                <FormControlLabel
                  value={CASH_MODE}
                  control={<Radio color="primary" />}
                  label="Cash"
                />
              </RadioGroup>
            </FormControl> */}
          {/* <FormControl component="fieldset" style={{ marginTop: '20px' }}>
              <FormLabel component="legend">Type</FormLabel>
              <RadioGroup
                aria-label="Type"
                name="type"
                value={type}
                onChange={handleTypeChange}
                style={{ flexDirection: 'row' }}
              >
                <FormControlLabel
                  value={DEBIT_TYPE}
                  control={<Radio color="primary" />}
                  label="Debit"
                />
                <FormControlLabel
                  value={CREDIT_TYPE}
                  control={<Radio color="primary" />}
                  label="Credit"
                />
              </RadioGroup>
            </FormControl>
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
            </FormControl> */}
          <div className={styles.fieldSet}>
            <div className={styles.fieldSetLabel}>Type</div>
            <div className={styles.radioGroupWrapper}>
              <div className={styles.radio}>
                <input type="radio" name="transactionType" id="credittype" value="Credit" />
                <label htmlFor="credittype">Credit</label>
              </div>
              <div className={styles.radio}>
                <input type="radio" name="transactionType" id="debittype" value="Debit" />
                <label htmlFor="debittype">Debit</label>
              </div>
            </div>
          </div>
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
      </div>
    </Dialog>
  )
};

export default AddTransactionModal;