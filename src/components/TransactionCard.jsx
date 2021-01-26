import React, { useState } from 'react';
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded';
import {
  editTransactionAction, editExpenditureAction, editAvailableBalAction
} from '../actions/actionCreator'
import { url } from '../Constants';
import { useDispatch } from 'react-redux';
import SnackBarFeedback from './SnackBarFeedback';
export default function TransactionCard({ transaction }) {
  const dispatch = useDispatch();
  const [editFieldVisible, setEditFieldVisibilty] = useState(false);
  const { heading, amount, _id } = transaction;

  const [head, setHead] = useState(heading);
  const [amt, setAmt] = useState(amount);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [msg, setMsg] = React.useState('');
  const [severity, setSeverity] = React.useState('');
  function handleClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };
  function handleEditSubmit() {
    const updatedTransaction = { ...transaction, heading: head, amount: amt };
    if (amt === '' || amt <= 0 || head === '') {
      setEditFieldVisibilty(false);
      setSnackbarOpen(true);
      let msg;
      if (head === '') {
        msg = 'Pleae Enter Title;'
        setHead(heading);
      } else {
        msg = 'Please Enter Valid Amount';
        setAmt(amount);
      }
      setMsg(msg);
      setSeverity('warning');
      return;
    };
    fetch(`${url.API_URL_EDIT_TRANSACTION}/?id=${_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedTransaction)
    })
      .then(
        () => {
          // console.log('Edited successfully');
          dispatch(editTransactionAction(_id, updatedTransaction));
          const changeAmt = parseInt(amt) - parseInt(amount);
          dispatch(editExpenditureAction(changeAmt));
          dispatch(editAvailableBalAction(-1 * changeAmt));
          setMsg('Transaction Edited Successfully!');
          setSeverity('success');
        },
        () => {
          console.log('Failed To edit')
          setMsg('Transaction Edit Failed!');
          setSeverity('error');
        }
      )
      .finally(() => {
        setEditFieldVisibilty(false)
        setSnackbarOpen(true);
      });
  }
  return (
    <>
      {editFieldVisible ?
        <div className="edit-field transaction-card">
          <input
            className="edit-field-input"
            type="text"
            value={head}
            onChange={(e) => setHead(e.target.value)}
          />
          <input
            className="edit-field-input edit-field-input-amt"
            type="number"
            value={amt}
            onChange={(e) => setAmt(e.target.value)}
          />
          <CheckCircleRoundedIcon onClick={handleEditSubmit} />
        </div> :
        (<div className="transaction-card" onClick={() => setEditFieldVisibilty(true)}>
          <p className="transaction-card-text">{heading}</p>
          <p className="transaction-card-text">{amount}</p>
        </div>)
      }
      <SnackBarFeedback open={snackbarOpen} handleClose={handleClose} severity={severity} msg={msg} />
    </>
  );
}