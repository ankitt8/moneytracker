import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Input from '@material-ui/core/Input';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import CircularIndeterminate from './Loader';
import { KeyboardDatePicker } from '@material-ui/pickers';
import FormLabel from "@material-ui/core/FormLabel";

import { addTransactionAction, editAvailableBalAction, editExpenditureAction, updateStatusAction } from '../actions/actionCreator'
import {
  ADD_TRANSACTION_FAIL_ERROR,
  url, ADD_TRANSACTION_SUCCESS_MSG,
  INVALID_TITLE_WARNING, INVALID_AMOUNT_WARNING
} from '../Constants';

const useStyles = makeStyles((theme) => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    width: 'fit-content',
  },
  formControl: {
    marginTop: theme.spacing(2),
    minWidth: 120,
  },
  formControlLabel: {
    marginTop: theme.spacing(1),
  },
  textField: {
    '& .MuiTextField-root': {
      // margin: theme.spacing(1),
      minWidth: 120,
    },
  },
}));

export default function QuoteAndAddIcon() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [heading, setHeading] = useState('');
  const [amount, setAmount] = useState('');
  const [loadingState, setLoadingState] = useState(false);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = React.useState("online");

  const handleChange = (event) => {
    setMode(event.target.value);
  };
  function handleheadingChange(event) {
    setHeading(event.target.value);
  };
  function handleAmountChange(event) {
    setAmount(event.target.value);
  };

  function handleTransactionSubmit() {
    if (amount === '' || amount <= 0 || heading === '') {
      setLoadingState(false);
      // setHeading('');
      // setAmount('');
      setDate(new Date());

      const msg = heading === '' ? INVALID_TITLE_WARNING : INVALID_AMOUNT_WARNING;
      dispatch(updateStatusAction({
        addTransaction: false,
        msg,
        severity: 'warning'
      }))
      // handleClose();
      return;
    }
    setLoadingState(true);
    const transaction = {
      heading,
      amount,
      date,
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
          console.log('Failed to add transaction', transaction);
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
        setDate(new Date());
        handleClose();
      })
  }

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div className="quote-and-add-icon">
        <div className="quote">Money Saved Is Money Earned</div>
        <AddOutlinedIcon fontSize="large" onClick={handleClickOpen} />
      </div>
      <Dialog
        maxWidth={'sm'}
        open={open}
        onClose={handleClose}
        aria-labelledby="max-width-dialog-title"
      >
        <DialogTitle id="max-width-dialog-title">Add Transaction</DialogTitle>
        <DialogContent>

          <form className={classes.root} noValidate autoComplete="off">
            <FormControl>
              <InputLabel htmlFor="heading">Title</InputLabel>
              <Input id="heading" value={heading} onChange={handleheadingChange} />
            </FormControl>
            <FormControl>
              <InputLabel htmlFor="amount">Amount</InputLabel>
              <Input type="number" id="amount" value={amount} onChange={handleAmountChange} />
            </FormControl>
            <FormControl>

              <KeyboardDatePicker
                style={{ marginTop: '20px' }}
                required
                autoOk
                variant="inline"
                inputVariant="standard"
                format="dd/MM/yyyy"
                value={date}
                InputAdornmentProps={{ position: 'start' }}
                onChange={(date) => setDate(date)}
              />

            </FormControl>
            <FormControl component="fieldset" style={{ marginTop: '20px' }}>
              <FormLabel component="legend">Mode</FormLabel>
              <RadioGroup
                aria-label="Mode"
                name="mode"
                value={mode}
                onChange={handleChange}
                style={{ flexDirection: 'row' }}
              >
                <FormControlLabel
                  value='online'
                  control={<Radio color="primary" />}
                  label="Online/Card"
                />
                <FormControlLabel
                  value='offline'
                  control={<Radio color="primary" />}
                  label="Cash"
                />
              </RadioGroup>

            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>


          <Button onClick={handleClose} >
            Close
          </Button>
          {loadingState ? <CircularIndeterminate /> :
            <Button onClick={handleTransactionSubmit} >
              Add
            </Button>
          }
        </DialogActions>
      </Dialog>
    </>

  )
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