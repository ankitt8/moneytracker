import React, { useState } from 'react';
import './styles.scss';
import { CREDIT_TYPE, DEBIT_TYPE } from "../../../Constants";
import AddTransactionModal from "../../AddTransactionModal/index";

interface CreditDebitSummaryAndAddPropsInterface {
    userId: object;
    title: string;
    mode: string;
    creditAmount: number;
    debitAmount: number;
}

const CreditDebitSummaryAndAdd: React.FC<CreditDebitSummaryAndAddPropsInterface> = ({
    userId,
    title,
    mode,
    creditAmount,
    debitAmount
}) => {
    const [open, setOpen] = useState(false);
    const [type, setType] = useState('');
    const [addTransactionModalTitle, setAddTransactionModalTitle] = useState('')
    const handleClose = () => {
        setOpen(false);
    };
    const handleCreditClick = (): void => {
        setType(CREDIT_TYPE);
        setOpen(true);
        setAddTransactionModalTitle(`${mode.toUpperCase()} ${CREDIT_TYPE.toUpperCase()} Transaction`);
    }
    const handleDebitClick = (): void => {
        setType(DEBIT_TYPE);
        setOpen(true);
        setAddTransactionModalTitle(`${mode.toUpperCase()} ${DEBIT_TYPE.toUpperCase()} Transaction`)
    }

    return (
        <>
            <div className="credit-debit-summary">
                <div className='title'>{title}</div>
                <div className='balance-and-add-transaction'>
                    <div>
                        <button
                            className='credit-debit-button'
                            onClick={handleCreditClick}
                        >
                            CR
                    </button>
                        {creditAmount}
                    </div>
                    <div>-</div>
                    <div>
                        <button
                            className='credit-debit-button'
                            onClick={handleDebitClick}
                        >
                            DR
                    </button>
                        {debitAmount}
                    </div>
                    <div>=</div>
                    <div>
                        {creditAmount - debitAmount}
                    </div>
                </div>

            </div>
            <AddTransactionModal
                modalTitle={addTransactionModalTitle}
                userId={userId}
                open={open}
                type={type}
                mode={mode}
                handleClose={handleClose}
            />
        </>

    )
}

export default CreditDebitSummaryAndAdd;