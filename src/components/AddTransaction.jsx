import React from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import CircularIndeterminate from './Loader';
import { addTransactionAction } from '../actions/actionCreator'
import { url } from '../Constants';
const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
    display: 'flex',
    alignItems: 'center'
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
    setLoadingState(true)
    const transaction = {
      heading,
      amount,
      date: new Date(),
    };
    const result = addTransactionToDatabase(transaction);
    result
      .then(
        function (res) {
          // console.log(res)
          dispatch(addTransactionAction(res));
        },
        function () {
          console.log('Failed to add transaction', transaction);
        }

      )
      .finally(() => {
        setLoadingState(false);
        setHeading('');
        setAmount('');
      })


  }
  async function addTransactionToDatabase(transaction) {
    setLoadingState(true);
    const res = await fetch(url.API_URL_ADD_TRANSACTION, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transaction),
    });
    const result = await res.json();
    // console.log(result)
    return result;
  }
  return (
    <form className={classes.root} noValidate autoComplete="off">
      <FormControl>
        <InputLabel htmlFor="heading">Title</InputLabel>
        <Input id="heading" value={heading} onChange={handleheadingChange} />
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="amount">Amount</InputLabel>
        <Input id="amount" value={amount} onChange={handleAmountChange} />
      </FormControl>
      {loadingState ? <CircularIndeterminate /> : <AddOutlinedIcon
        fontSize="large"
        onClick={handleTransactionSubmit}
      />}
    </form>
  );
}
