import React, { useState } from 'react';
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';
import {
  editTransactionAction, editExpenditureAction, editAvailableBalAction, deleteTransactionAction
} from '../actions/actionCreator'
import { INVALID_AMOUNT_WARNING, url, INVALID_TITLE_WARNING, EDIT_TRANSACTION_SUCCESS_MSG, EDIT_TRANSACTION_FAIL_ERROR, DELETE_TRANSACTION_SUCCESS_MSG, DELETE_TRANSACTION_FAIL_ERROR } from '../Constants';
import { useDispatch } from 'react-redux';
import SnackBarFeedback from './SnackBarFeedback';
export default function TransactionCard({
  transaction,
}) {
  const dispatch = useDispatch();
  const { heading, amount, _id } = transaction;
  const [editFieldVisible, setEditFieldVisibilty] = useState(false);
  const [head, setHead] = useState(heading);
  const [amt, setAmt] = useState(amount);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [severity, setSeverity] = useState('');
  function handleClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };
  function deleteTransaction() {

    fetch(`${url.API_URL_DELETE_TRANSACTION}/?id=${_id}`, {
      method: 'POST'
    })
      .then(
        function success() {
          dispatch(editExpenditureAction(-1 * parseInt(amount)));
          dispatch(editAvailableBalAction(parseInt(amount)));
          setMsg(DELETE_TRANSACTION_SUCCESS_MSG);
          setSeverity('success');
          console.log('Delted successfully')
          dispatch(deleteTransactionAction(_id));
        },
        function error() {
          console.log('Failed To delete')
          setMsg(DELETE_TRANSACTION_FAIL_ERROR);
          setSeverity('error');
        }
      )
      .finally(() => {
        setEditFieldVisibilty(false)
        setSnackbarOpen(true);

      })
  }
  function handleEditSubmit() {
    const updatedTransaction = { ...transaction, heading: head, amount: amt };
    if (amt === '' || amt <= 0 || head === '') {
      setEditFieldVisibilty(false);
      setSnackbarOpen(true);
      let msg;
      if (head === '') {
        msg = INVALID_TITLE_WARNING;
        setHead(heading);
      } else {
        msg = INVALID_AMOUNT_WARNING;
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
          setMsg(EDIT_TRANSACTION_SUCCESS_MSG);
          setSeverity('success');
        },
        () => {
          console.log('Failed To edit')
          setMsg(EDIT_TRANSACTION_FAIL_ERROR);
          setSeverity('error');

        }
      )
      .finally(() => {
        setEditFieldVisibilty(false)
        setSnackbarOpen(true);
        setSnackbarOpen(true);
      });
  }
  return (
    <>
      {editFieldVisible ?
        <div className="edit-field transaction-card">
          <DeleteRoundedIcon onClick={deleteTransaction} />
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