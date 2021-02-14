import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import {makeStyles} from '@material-ui/core/styles';
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
import Loader from './Loader';
import {KeyboardDatePicker} from '@material-ui/pickers';
import FormLabel from "@material-ui/core/FormLabel";

import {
  addTransactionAction,
  editBankCreditAction,
  editBankDebitAction,
  editCashCreditAction,
  editCashDebitAction,
  updateStatusAction
} from '../actions/actionCreator'
import {
  ADD_TRANSACTION_FAIL_ERROR,
  ADD_TRANSACTION_SUCCESS_MSG,
  CASH_MODE,
  CREDIT_TYPE,
  DEBIT_TYPE,
  INVALID_AMOUNT_WARNING,
  INVALID_TITLE_WARNING,
  ONLINE_MODE,
  url
} from '../Constants';
import styled from 'styled-components';

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

export default function QuoteAndAddIcon({userId}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [heading, setHeading] = useState('');
  const [amount, setAmount] = useState('');
  const [loadingState, setLoadingState] = useState(false);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = React.useState('online');
  const [type, setType] = React.useState('debit');
  const handleModeChange = (event) => {
    setMode(event.target.value);
  }
  const handleheadingChange = (event) => {
    setHeading(event.target.value);
  }
  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  }
  const handleTypeChange = (event) => {
    setType(event.target.value);
  }

  function handleTransactionSubmit() {
    if (amount === '' || amount <= 0 || heading === '') {
      // TODO if date is not changed then no need to set the date again
      setDate(new Date());

      const msg = (heading === '' ? INVALID_TITLE_WARNING : INVALID_AMOUNT_WARNING);
      dispatch(updateStatusAction({
        addTransaction: false,
        msg,
        severity: 'warning'
      }))
      return;
    }
    // const intAmount = parseInt(amount);
    // no need reason the db will automatically convert to int
    // the string value but if empty string is returned
    // then there will be propble since parseInt('') returns
    // NaN so we should ensure that empty string is not passed
    setLoadingState(true);
    const transaction = {
      heading,
      amount,
      date,
      mode,
      type,
      userId
    };
    const result = addTransactionToDatabase(transaction);
    result
      .then(
        function (res) {
          const intAmount = parseInt(amount);
          dispatch(addTransactionAction(res));
          if (type === DEBIT_TYPE) {
            if (mode === CASH_MODE) {
              dispatch(editCashDebitAction(intAmount));
            } else if (mode === ONLINE_MODE) {
              dispatch(editBankDebitAction(intAmount));
            }
          } else {
            if (mode === CASH_MODE) {
              dispatch(editCashCreditAction(intAmount));
            } else if (mode === ONLINE_MODE) {
              dispatch(editBankCreditAction(intAmount));
            }
          }


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
        <div className="quote">You should know where you are spending</div>
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
              <Input id="heading" value={heading} onChange={handleheadingChange}/>
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
                  onChange={handleModeChange}
                  style={{flexDirection: 'row'}}
              >
                <FormControlLabel
                    value={ONLINE_MODE}
                    control={<Radio color="primary"/>}
                    label="Online/Card"
                />
                <FormControlLabel
                    value={CASH_MODE}
                    control={<Radio color="primary"/>}
                    label="Cash"
                />
              </RadioGroup>
            </FormControl>
            <FormControl component="fieldset" style={{marginTop: '20px'}}>
              <FormLabel component="legend">Type</FormLabel>
              <RadioGroup
                  aria-label="Type"
                  name="type"
                  value={type}
                  onChange={handleTypeChange}
                  style={{flexDirection: 'row'}}
              >
                <FormControlLabel
                    value={DEBIT_TYPE}
                    control={<Radio color="primary"/>}
                    label="Debit"
                />
                <FormControlLabel
                    value={CREDIT_TYPE}
                    control={<Radio color="primary"/>}
                    label="Credit"
                />
              </RadioGroup>
            </FormControl>
          </form>
          <StyledButtonWrapper style={{justifyContent: 'space-between'}}>
            <StyledButton onClick={handleClose}>
              Close
            </StyledButton>
            {loadingState ? <Loader/> :
                <StyledButton onClick={handleTransactionSubmit}>
                  Add
                </StyledButton>
            }
          </StyledButtonWrapper>
        </DialogContent>

      </Dialog>
    </>

  )
}
const StyledButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

const StyledButton = styled.button`
  background-color: #3f51b5;
  padding: 10px;
  border-radius: 5px;
  color: white;
  font-size: 18px;
  width: 30%;
`;

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