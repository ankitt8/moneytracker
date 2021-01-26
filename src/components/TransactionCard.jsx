import React, { useState } from 'react';
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';
import {
  editTransactionAction, editExpenditureAction, editAvailableBalAction, deleteTransactionAction, updateStatusAction
} from '../actions/actionCreator'
import {
  INVALID_AMOUNT_WARNING,
  url,
  INVALID_TITLE_WARNING,
  EDIT_TRANSACTION_SUCCESS_MSG,
  EDIT_TRANSACTION_FAIL_ERROR, DELETE_TRANSACTION_SUCCESS_MSG, DELETE_TRANSACTION_FAIL_ERROR
} from '../Constants';
import { useDispatch } from 'react-redux';
export default function TransactionCard({
  transaction,
}) {
  const dispatch = useDispatch();
  const { heading, amount, _id } = transaction;
  const [editFieldVisible, setEditFieldVisibilty] = useState(false);
  const [head, setHead] = useState(heading);
  const [amt, setAmt] = useState(amount);
  function deleteTransaction() {

    fetch(`${url.API_URL_DELETE_TRANSACTION}/?id=${_id}`, {
      method: 'POST'
    })
      .then(
        function success() {
          dispatch(editExpenditureAction(-1 * parseInt(amount)));
          dispatch(editAvailableBalAction(parseInt(amount)));
          dispatch(deleteTransactionAction(_id));
          dispatch(updateStatusAction({
            deleteTransaction: true,
            msg: DELETE_TRANSACTION_SUCCESS_MSG,
            severity: 'success'
          }))
        },
        function error() {
          console.log('Failed To delete')
          setEditFieldVisibilty(false)
          dispatch(updateStatusAction({
            deleteTransaction: false,
            msg: DELETE_TRANSACTION_FAIL_ERROR,
            severity: 'error',
          }))
        }
      )
  }
  function handleEditSubmit() {
    const updatedTransaction = { ...transaction, heading: head, amount: amt };
    if (amt === '' || amt <= 0 || head === '') {
      setEditFieldVisibilty(false);
      // setSnackbarOpen(true);
      let msg;
      if (head === '') {
        msg = INVALID_TITLE_WARNING;
        setHead(heading);
      } else {
        msg = INVALID_AMOUNT_WARNING;
        setAmt(amount);
      }
      dispatch(updateStatusAction({
        editTransaction: false,
        msg,
        severity: 'warning',
      }))
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
          dispatch(editTransactionAction(_id, updatedTransaction));
          const changeAmt = parseInt(amt) - parseInt(amount);
          dispatch(editExpenditureAction(changeAmt));
          dispatch(editAvailableBalAction(-1 * changeAmt));
          dispatch(updateStatusAction({
            editTransaction: true,
            msg: EDIT_TRANSACTION_SUCCESS_MSG,
            severity: 'success',
          }))
        },
        () => {
          console.log('Failed To edit')
          dispatch(updateStatusAction({
            editTransaction: false,
            msg: EDIT_TRANSACTION_FAIL_ERROR,
            severity: 'error'
          }))
        }
      )
      .finally(() => {
        setEditFieldVisibilty(false)
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
      {/* <SnackBarFeedback open={snackbarOpen} handleClose={handleClose} severity={severity} msg={msg} /> */}
    </>
  );
}