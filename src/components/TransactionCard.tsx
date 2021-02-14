import React, {useState} from 'react';
import EditTransactionModal from "./EditTransactionModal";
import {TransactionInterface} from '../helpers/helper'
import styled from 'styled-components'

interface TransactionCardProps {
    transaction: TransactionInterface
}

const StyledTransactionCard = styled.div`
  height: 40px;
  margin-bottom: 5px;
  padding: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid grey;
  border-radius: 2px;
  box-shadow: 1px 1px lightgrey;
`;
const TransactionCard: React.FC<TransactionCardProps> = ({
                                                             transaction,
                                                         }) => {
    const [open, setOpen] = useState(false);
    const {heading, amount} = transaction;
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    // need to show green card or maybe some better minimilastic UI to show
    // the transaction type is credit type
    // const color = transaction.type === CREDIT_TYPE ? 'greeen' : '';
    return (
        <>
            <StyledTransactionCard
                onClick={handleClickOpen}
            >
                <p className="transaction-card-text">{heading}</p>
                <p className="transaction-card-text">{amount}</p>
            </StyledTransactionCard>
            <EditTransactionModal transaction={transaction} open={open} handleClose={handleClose}/>
        </>
    );
}

export default TransactionCard;