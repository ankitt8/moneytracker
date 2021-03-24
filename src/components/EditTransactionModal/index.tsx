import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Input from '@material-ui/core/Input';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Loader from '../Loader';
import { KeyboardDatePicker } from '@material-ui/pickers';
import FormLabel from '@material-ui/core/FormLabel';
import cn from 'classnames';
import CategoryFormInput from 'components/AddTransactionModal/CategoryInput';

import {
    CASH_MODE,
    CREDIT_TYPE,
    DEBIT_TYPE,
    DELETE_TRANSACTION_FAIL_ERROR,
    DELETE_TRANSACTION_SUCCESS_MSG,
    EDIT_TRANSACTION_FAIL_ERROR,
    EDIT_TRANSACTION_SUCCESS_MSG,
    INVALID_AMOUNT_WARNING,
    INVALID_TITLE_WARNING,
    ONLINE_MODE,
    SEVERITY_ERROR,
    SEVERITY_SUCCESS,
    SEVERITY_WARNING,
} from 'Constants';
import {
    deleteTransactionAction,
    editBankCreditAction,
    editBankDebitAction,
    editCashCreditAction,
    editCashDebitAction,
    editTransactionAction,
    updateStatusAction
} from 'actions/actionCreator';
import { EditTransactionModalProps } from './interface';
import styles from './styles.module.scss';
import { deleteTransactionDB, editTransactionDB } from 'helper';

const EditTransactionModal: React.FC<EditTransactionModalProps> = ({
    transaction,
    handleClose
}) => {
    const dispatch = useDispatch();
    const [editedTransaction, setEditedTransaction] = useState(transaction);
    const [editLoading, setEditLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const { _id: id, mode, type, amount, heading } = transaction;
    // @ts-ignore
    const transactionCategories = useSelector((state) => state.transactions.categories);
    let categories: string[];

    if (type === DEBIT_TYPE) {
        categories = transactionCategories.debit;
    } else {
        categories = transactionCategories.credit;
    }
    useEffect(() => {
        return function cleanUp() {
            setEditLoading(false);
            setDeleteLoading(false);
            setEditedTransaction(transaction);
        }
    }, []);

    const handleModeChange = (event: any) => {
        //For now not changing the mode will do it later
        // setEditedTransaction({...editedTransaction, mode: event.target.value});
    }
    const handleHeadingChange = (event: any) => {
        setEditedTransaction({ ...editedTransaction, heading: event.target.value });
    }
    const handleAmountChange = (event: any) => {
        let amount;
        if (event.target.value === '') {
            amount = 0;
        } else {
            amount = parseInt(event.target.value);
        }
        setEditedTransaction({ ...editedTransaction, amount });
    }
    const handleTypeChange = (event: any) => {
        // setEditedTransaction({...editedTransaction, type: event.target.value});
    }
    const handleDateChange = (date: any) => {
        setEditedTransaction({ ...transaction, date })
    }
    const handleCategoryChange = (category: string) => {
        setEditedTransaction({
            ...editedTransaction,
            category
        })
    }

    function handleDeleteTransaction() {
        setDeleteLoading(true);
        deleteTransactionDB(id)
            .then(function onFulfilled(res) {
                const { transactionId } = res;
                if (type === DEBIT_TYPE) {
                    if (mode === ONLINE_MODE || mode === undefined) {
                        // while deleting edited values should not be taken
                        dispatch(editBankDebitAction(-1 * amount));
                    } else {
                        dispatch(editCashDebitAction(-1 * amount));
                    }
                } else {
                    if (mode === ONLINE_MODE) {
                        dispatch(editBankCreditAction(-1 * amount));
                    } else {
                        dispatch(editCashCreditAction(-1 * amount));
                    }
                }
                handleClose();
                dispatch(deleteTransactionAction(transactionId));
                dispatch(updateStatusAction({
                    showFeedback: true,
                    msg: DELETE_TRANSACTION_SUCCESS_MSG,
                    severity: SEVERITY_SUCCESS
                }))
            })
            .catch(function onRejected(error) {
                dispatch(updateStatusAction({
                    showFeedback: true,
                    msg: DELETE_TRANSACTION_FAIL_ERROR,
                    severity: SEVERITY_ERROR,
                }));
                handleClose();
                console.error(error);
            });
    }

    function handleEditTransaction() {
        const { amount: updatedAmount, heading: editedHeading } = editedTransaction;
        if (updatedAmount <= 0 || editedHeading === '') {
            let msg;
            if (editedHeading === '') {
                msg = INVALID_TITLE_WARNING;
                setEditedTransaction({ ...editedTransaction, heading });
            } else {
                msg = INVALID_AMOUNT_WARNING;
                setEditedTransaction({ ...editedTransaction, amount });
            }
            dispatch(updateStatusAction({
                showFeedback: true,
                msg,
                severity: SEVERITY_WARNING,
            }))
            return;
        }
        setEditLoading(true);

        editTransactionDB(id, editedTransaction)
            .then(function onFulfilled(updatedTransactionObject) {
                dispatch(editTransactionAction(id, updatedTransactionObject));
                const { type: editedType, mode: editedMode } = updatedTransactionObject;
                const changedAmount = updatedAmount - transaction.amount;
                if (editedType === DEBIT_TYPE) {
                    //if changedAmount negative implies less spent, increase in balance
                    if (editedMode === CASH_MODE) {
                        dispatch(editCashDebitAction(changedAmount));
                    } else if (editedMode === ONLINE_MODE) {
                        dispatch(editBankDebitAction(changedAmount));
                    }
                } else {
                    if (editedMode === CASH_MODE) {
                        dispatch(editCashCreditAction(changedAmount));
                    } else if (editedMode === ONLINE_MODE) {
                        dispatch(editBankCreditAction(changedAmount));
                    }
                }
                dispatch(updateStatusAction({
                    showFeedback: true,
                    msg: EDIT_TRANSACTION_SUCCESS_MSG,
                    severity: SEVERITY_SUCCESS
                }))
            })
            .catch(function onRejected(error) {
                console.error(error);
                dispatch(updateStatusAction({
                    showFeedback: true,
                    msg: EDIT_TRANSACTION_FAIL_ERROR,
                    severity: SEVERITY_ERROR
                }))
            })
            .finally(handleClose);
    }

    return (
        <Dialog
            maxWidth={'sm'}
            open={true}
            onClose={handleClose}
            aria-labelledby="max-width-dialog-heading"
        >
            <DialogTitle id="max-width-dialog-heading">Edit Transaction</DialogTitle>
            <DialogContent>
                <form noValidate autoComplete="off">
                    <FormControl>
                        <InputLabel htmlFor="heading">heading</InputLabel>
                        <Input id="heading" value={editedTransaction.heading} onChange={handleHeadingChange} />
                    </FormControl>
                    <FormControl>
                        <InputLabel htmlFor="amount">Amount</InputLabel>
                        <Input type="number" id="amount" value={editedTransaction.amount}
                            onChange={handleAmountChange} />
                    </FormControl>
                    <FormControl>
                        <KeyboardDatePicker
                            style={{ marginTop: '20px' }}
                            required
                            autoOk
                            variant="inline"
                            inputVariant="standard"
                            format="dd/MM/yyyy"
                            value={editedTransaction.date}
                            InputAdornmentProps={{ position: 'start' }}
                            onChange={(date) => handleDateChange(date)}
                        />
                    </FormControl>
                    <FormControl component="fieldset" style={{ marginTop: '20px' }}>
                        <FormLabel component="legend">Mode</FormLabel>
                        <RadioGroup
                            aria-label="Mode"
                            name="mode"
                            value={editedTransaction.mode}
                            onChange={handleModeChange}
                            style={{ flexDirection: 'row' }}
                        >
                            <FormControlLabel
                                value={ONLINE_MODE}
                                control={<Radio color="primary" />}
                                label="Online/Card"
                            />
                            <FormControlLabel
                                value={CASH_MODE}
                                control={<Radio color="primary" />}
                                label="Cash"
                            />
                        </RadioGroup>
                    </FormControl>
                    <FormControl component="fieldset" style={{ marginTop: '20px' }}>
                        <FormLabel component="legend">Type</FormLabel>
                        <RadioGroup
                            aria-label="Type"
                            name="type"
                            value={editedTransaction.type || DEBIT_TYPE}
                            onChange={handleTypeChange}
                            style={{ flexDirection: 'row' }}
                        >
                            <FormControlLabel
                                value={DEBIT_TYPE}
                                control={<Radio color="primary" />}
                                label="Debit"
                            />
                            <FormControlLabel
                                value={CREDIT_TYPE}
                                control={<Radio color="primary" />}
                                label="Credit"
                            />
                        </RadioGroup>
                    </FormControl>
                    <CategoryFormInput
                        categories={categories}
                        categorySelected={editedTransaction.category || ''}
                        handleCategoryChange={handleCategoryChange}
                    />
                </form>
                <div className={styles.buttonWrapper}>
                    {
                        deleteLoading ? <Loader /> :
                            <button className={cn(styles.button, styles.delete)} onClick={handleDeleteTransaction}>
                                Delete
                            </button>
                    }
                    {
                        editLoading ? <Loader /> :
                            <button className={cn(styles.button, styles.edit)} onClick={handleEditTransaction}>
                                Edit
                            </button>
                    }
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default EditTransactionModal;