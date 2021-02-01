import React from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import CircularIndeterminate from './Loader';
import { addTransactionAction, editAvailableBalAction, editExpenditureAction, updateStatusAction } from '../actions/actionCreator'
import {
  ADD_TRANSACTION_FAIL_ERROR,
  url, ADD_TRANSACTION_SUCCESS_MSG,
  INVALID_TITLE_WARNING, INVALID_AMOUNT_WARNING
} from '../Constants';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
    display: 'flex',
    alignItems: 'center',
    margin: 5
  },
}));

export default function AddTransaction() {
  const dispatch = useDispatch();
  const [heading, setHeading] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [loadingState, setLoadingState] = React.useState(false);
  const classes = useStyles();
  function handleheadingChange(event) {
    setHeading(event.target.value);
  };
  function handleAmountChange(event) {
    setAmount(event.target.value);
  };

  function handleTransactionSubmit() {
    if (amount === '' || amount <= 0 || heading === '') {
      setLoadingState(false);
      setHeading('');
      setAmount('');
      const msg = heading === '' ? INVALID_TITLE_WARNING : INVALID_AMOUNT_WARNING;
      dispatch(updateStatusAction({
        addTransaction: false,
        msg,
        severity: 'warning'
      }))
      return;
    }
    setLoadingState(true);
    const transaction = {
      heading,
      amount,
      date: new Date(),
    };
    const result = addTransactionToDatabase(transaction);
    result
      .then(
        function (res) {
          dispatch(addTransactionAction(res));
          dispatch(editExpenditureAction(parseInt(amount)));
          dispatch(editAvailableBalAction(-1 * parseInt(amount)));
          dispatch(updateStatusAction({
            addTransaction: true,
            msg: ADD_TRANSACTION_SUCCESS_MSG,
            severity: 'success'
          }))
        },
        function () {
          // console.log('Failed to add transaction', transaction);
          dispatch(updateStatusAction({
            addTransaction: false,
            msg: ADD_TRANSACTION_FAIL_ERROR,
            severity: 'error'
          }))
        }
      )
      .finally(() => {
        setLoadingState(false);
        setHeading('');
        setAmount('');
      })
  }
  return (
    <>
      <form className={classes.root} noValidate autoComplete="off">
        <FormControl>
          <InputLabel htmlFor="heading">Title</InputLabel>
          <Input id="heading" value={heading} onChange={handleheadingChange} />
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="amount">Amount</InputLabel>
          <Input type="number" id="amount" value={amount} onChange={handleAmountChange} />
        </FormControl>
        {loadingState ? <CircularIndeterminate /> : <AddOutlinedIcon
          fontSize="large"
          onClick={handleTransactionSubmit}
        />}
      </form>
    </>

  );
}
async function addTransactionToDatabase(transaction) {
  const res = await fetch(url.API_URL_ADD_TRANSACTION, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(transaction),
  });
  const result = await res.json();
  return result;
}
