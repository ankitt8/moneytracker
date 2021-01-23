import React, { useState } from 'react';
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded';
import { editTransactionAction } from '../actions/actionCreator'
import { url } from '../Constants';
import { useDispatch } from 'react-redux';
export default function TransactionCard({ transaction }) {
  const dispatch = useDispatch();
  const [editFieldVisible, setEditFieldVisibilty] = useState(false);
  const { heading, amount, _id } = transaction;
  const [head, setHead] = useState(heading);
  const [amt, setAmt] = useState(amount);
  function handleEditSubmit() {
    console.log(head)
    console.log(amt)
    // const produri = 'https://moneytrackerbackend.herokuapp.com/api/edit_transaction';
    const updatedTransaction = { ...transaction, heading: head, amount: amt };
    fetch(`${url.API_URL_EDIT_TRANSACTION}/?id=${_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedTransaction)
    })
      .then(
        () => {
          console.log('Edited successfully');
          dispatch(editTransactionAction(_id, updatedTransaction));
        },
        () => { console.log('Failed To edit') }
      )
      .finally(() => setEditFieldVisibilty(false));
  }
  return (
    editFieldVisible ?
      <div className="edit-field transaction-card">
        <input
          className="edit-field-input"
          type="text"
          value={head}
          onChange={(e) => setHead(e.target.value)}
        />
        <input
          className="edit-field-input edit-field-input-amt"
          type="text"
          value={amt}
          onChange={(e) => setAmt(e.target.value)}
        />
        <CheckCircleRoundedIcon onClick={handleEditSubmit} />
      </div> :
      (<div className="transaction-card" onClick={() => setEditFieldVisibilty(true)}>
        <h3>{heading}</h3>
        <h3>{amount}</h3>
      </div>)
  );
}