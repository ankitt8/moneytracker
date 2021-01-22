import React from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import FilledInput from '@material-ui/core/FilledInput';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import CircularIndeterminate from './Loader';
import { createAddTransactionAction } from '../actions/actionCreator'
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
        function () {
          console.log('success')
          dispatch(createAddTransactionAction(transaction));
        },
        function () {
          console.log('Failed to add transaction ', transaction);
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

    const devuri = `http://localhost:8080/api/add_transaction`;
    const produri = 'https://moneytrackerbackend.herokuapp.com/api/add_transaction';
    const result = await fetch(produri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transaction),
    });
    return result;
  }
  return (
    <form className={classes.root} noValidate autoComplete="off">
      <FormControl>
        <InputLabel htmlFor="component-simple">Name</InputLabel>
        <Input id="component-simple" value={heading} onChange={handleheadingChange} />
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="component-simple">Amount</InputLabel>
        <Input id="component-simple" value={amount} onChange={handleAmountChange} />
      </FormControl>
      {loadingState ? <CircularIndeterminate /> : <AddOutlinedIcon
        fontSize="large"
        onClick={handleTransactionSubmit}
      />}
    </form>
  );
}
