import React, { useState } from 'react';
import EditTransactionModal from './EditTransactionModal';
import { TransactionInterface } from '../helpers/helper';
import styled from 'styled-components';
import { CREDIT_TYPE } from '../Constants';

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
`;
const TransactionCard: React.FC<TransactionCardProps> = ({
    transaction,
}) => {
    const [open, setOpen] = useState(false);
    const { heading, amount } = transaction;
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    let transactionCardTextStyle = "transaction-card-text";
    if (transaction.type === CREDIT_TYPE) {
        transactionCardTextStyle += " transaction-card-credit";
    }

    return (
        <>
            <StyledTransactionCard
                onClick={handleClickOpen}
            >
                <p className={transactionCardTextStyle}>{heading}</p>
                <p className={transactionCardTextStyle}>{amount}</p>
            </StyledTransactionCard>
            <EditTransactionModal transaction={transaction} open={open} handleClose={handleClose} />
        </>
    );
}

export default TransactionCard;