import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Loader from '../Loader';
import CategoryFormInput from '../CategoryFormInput'
import { KeyboardDatePicker } from '@material-ui/pickers';
import { AddTransactionInterface } from './interface';

import styles from './styles.module.scss';

import {
    addTransactionAction,
    editBankCreditAction,
    editBankDebitAction,
    editCashCreditAction,
    editCashDebitAction,
    updateStatusAction
} from '../../actions/actionCreator'
import {
    ADD_TRANSACTION_FAIL_ERROR,
    ADD_TRANSACTION_SUCCESS_MSG,
    CASH_MODE,
    DEBIT_TYPE,
    INVALID_AMOUNT_WARNING,
    INVALID_TITLE_WARNING,
    ONLINE_MODE,
    url
} from '../../Constants';
import styled from 'styled-components';

interface AddTransactionModalPropsInterface {
    modalTitle: string;
    userId: object;
    open: boolean;
    type: string;
    mode: string;
    handleClose: () => void;
}

const AddTransactionModal: React.FC<AddTransactionModalPropsInterface> = ({
    modalTitle,
    userId,
    open,
    type,
    mode,
    handleClose,
}) => {
    const dispatch = useDispatch();
    const [heading, setHeading] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date());
    const [category, setCategory] = useState('');
    const [loadingState, setLoadingState] = useState(false);

    const handleSelectedCategory = (category: string) => {
        setCategory(category);
    }

    const handleHeadingChange = (event: any) => {
        setHeading(event.target.value);
    }
    const handleAmountChange = (event: any) => {
        setAmount(event.target.value);
    }
    const handleDateChange = (value: any) => {
        setDate(new Date(value));
    }

    function handleTransactionSubmit() {

        if (parseInt(amount) <= 0 || heading === '') {
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

        setLoadingState(true);
        const transaction = {
            userId,
            heading,
            amount: parseInt(amount),
            date,
            mode,
            type,
            category,
        };
        const result = addTransactionToDatabase(transaction);
        result
            .then(
                function success(res) {
                    dispatch(addTransactionAction(res));
                    const { amount, mode } = res;
                    if (type === DEBIT_TYPE) {
                        if (mode === CASH_MODE) {
                            dispatch(editCashDebitAction(amount));
                        } else if (mode === ONLINE_MODE) {
                            dispatch(editBankDebitAction(amount));
                        }
                    } else {
                        if (mode === CASH_MODE) {
                            dispatch(editCashCreditAction(amount));
                        } else if (mode === ONLINE_MODE) {
                            dispatch(editBankCreditAction(amount));
                        }
                    }
                    dispatch(updateStatusAction({
                        addTransaction: true,
                        msg: ADD_TRANSACTION_SUCCESS_MSG,
                        severity: 'success'
                    }))
                },
                function error() {
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

    return (
        <Dialog
            maxWidth={'sm'}
            open={open}
            onClose={handleClose}
            aria-labelledby="max-width-dialog-title"
        >
            <DialogTitle id="max-width-dialog-title">{modalTitle}</DialogTitle>
            <DialogContent>
                <form noValidate autoComplete="off">
                    <FormControl>
                        <InputLabel htmlFor="heading">Title</InputLabel>
                        <Input id="heading" value={heading} onChange={handleHeadingChange} />
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
                            onChange={(value) => handleDateChange(value)}
                        />
                    </FormControl>
                    <CategoryFormInput
                        handleSelectedCategory={handleSelectedCategory}
                        type={type}
                    />
                </form>
                <div className={styles.buttonWrapper}>
                    <button
                        className={styles.addTransactionModalButton}
                        onClick={handleClose}
                    >
                        Close
                    </button>
                    {
                        loadingState ? <Loader /> :
                            <button
                                className={styles.addTransactionModalButton}
                                onClick={handleTransactionSubmit}
                            >
                                Add
                            </button>
                    }
                </div>
            </DialogContent>
        </Dialog>
    )
};

const addTransactionToDatabase: (transaction: AddTransactionInterface) => Promise<any> = async function (
    transaction: AddTransactionInterface
): Promise<any> {
    const res = await fetch(url.API_URL_ADD_TRANSACTION, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction),
    });
    return await res.json();
};

export default AddTransactionModal;