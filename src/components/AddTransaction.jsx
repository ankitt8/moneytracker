import React from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import CircularIndeterminate from './Loader';
import { addTransactionAction, editAvailableBalAction, editExpenditureAction } from '../actions/actionCreator'
import { url } from '../Constants';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
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
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [msg, setMsg] = React.useState('');
  const [severity, setSeverity] = React.useState('');
  const [loadingState, setLoadingState] = React.useState(false);
  const classes = useStyles();
  function handleheadingChange(event) {
    setHeading(event.target.value);
  };
  function handleAmountChange(event) {
    setAmount(event.target.value);
  };
  function handleClose(event, reason)  {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  function handleTransactionSubmit() {
    if (amount === '' || amount <= 0 || heading === '') {
      setLoadingState(false);
      setHeading('');
      setAmount('');
      setSnackbarOpen(true);
      const msg = heading === '' ? 'Please Enter Title!' : 'Please Enter Valid Amount';
      setMsg(msg);
      setSeverity('warning');
      return;
    }
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
          dispatch(editExpenditureAction(parseInt(amount)));
          dispatch(editAvailableBalAction(-1*parseInt(amount)));
          setMsg('Transaction Added Successfully!');
          setSeverity('success');
        },
        function () {
          console.log('Failed to add transaction', transaction);
          // setSnackbarOpen(true);
          setMsg('Transaction Addition Failed!');
          setSeverity('error');
        }

      )
      .finally(() => {
        setLoadingState(false);
        setHeading('');
        setAmount('');
        setSnackbarOpen(true);
      })


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
    // console.log(result)
    return result;
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
    <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity}>
          {msg}
        </Alert>
      </Snackbar>
    </>
  );
}

