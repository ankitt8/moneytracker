import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';
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
    url
} from "../Constants";
import {
    deleteTransactionAction,
    editBankCreditAction,
    editBankDebitAction,
    editCashCreditAction,
    editCashDebitAction,
    editTransactionAction,
    updateStatusAction
} from "../actions/actionCreator";
import {TransactionInterface} from "../helpers/helper";

interface EditTransactionModalProps {
    transaction: TransactionInterface
    open: boolean
    handleClose: () => void
}

const EditTransactionModal: React.FC<EditTransactionModalProps> = ({
                                                                       transaction,
                                                                       open,
                                                                       handleClose
                                                                   }) => {
    const dispatch = useDispatch();
    if (transaction.type === undefined) transaction.type = DEBIT_TYPE;
    const [editedTransaction, setEditedTransaction] = useState(transaction);
    const [editLoading, setEditLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const {_id, mode, type, amount, heading} = transaction;
    const handleModeChange = (event: any) => {
        //For now not changing the mode will do it later
        // setEditedTransaction({...editedTransaction, mode: event.target.value});
    }
    const handleHeadingChange = (event: any) => {
        setEditedTransaction({...editedTransaction, heading: event.target.value});
    }
    const handleAmountChange = (event: any) => {
        setEditedTransaction({...editedTransaction, amount: parseInt(event.target.value)});
    }
    const handleTypeChange = (event: any) => {
        // setEditedTransaction({...editedTransaction, type: event.target.value});
    }
    const handleDateChange = (date: any) => {
        setEditedTransaction({...transaction, date})
    }

    function handleDeleteTransaction() {
        setDeleteLoading(true);
        fetch(`${url.API_URL_DELETE_TRANSACTION}/?id=${_id}`, {
            method: 'POST'
        })
            .then(
                function success(res) {
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

                    dispatch(updateStatusAction({
                        deleteTransaction: true,
                        msg: DELETE_TRANSACTION_SUCCESS_MSG,
                        severity: 'success'
                    }))
                    setDeleteLoading(false);
                    handleClose();
                    dispatch(deleteTransactionAction(_id));
                },
                function error() {
                    // handleClose();
                    dispatch(updateStatusAction({
                        deleteTransaction: false,
                        msg: DELETE_TRANSACTION_FAIL_ERROR,
                        severity: 'error',
                    }))
                    setDeleteLoading(false);
                    handleClose();
                }
            )
            .finally(() => {
                // calling below things will throw error that you are calling on
                // unmounted component since when deleteTransaction action is dispatch
                // the card will be deleted
                // setDeleteLoading(false);
                // handleClose();
            })
    }

    function handleEditTransaction() {
        const {amount: updatedAmount, heading: editedHeading} = editedTransaction;
        if (updatedAmount <= 0 || editedHeading === '') {
            let msg;
            if (editedHeading === '') {
                msg = INVALID_TITLE_WARNING;
                setEditedTransaction({...editedTransaction, heading});
            } else {
                msg = INVALID_AMOUNT_WARNING;
                setEditedTransaction({...editedTransaction, amount});
            }
            dispatch(updateStatusAction({
                editTransaction: false,
                msg,
                severity: 'warning',
            }))
            return;
        }
        setEditLoading(true);
        fetch(`${url.API_URL_EDIT_TRANSACTION}/?id=${_id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(editedTransaction)
        })
            .then(
                () => {
                    dispatch(editTransactionAction(_id, editedTransaction));
                    const {type: editedType, mode: editedMode} = editedTransaction;
                    const changedAmount = updatedAmount - transaction.amount;
                    if (editedType === DEBIT_TYPE) {
                        //if changedAmount negative implies less spent, increase in balance
                        if (editedMode === CASH_MODE) {
                            editCashDebitAction(changedAmount);
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
                setEditLoading(false);
                handleClose();
            });
    }

    return (
        <Dialog
            maxWidth={'sm'}
            open={open}
            onClose={handleClose}
            aria-labelledby="max-width-dialog-title"
        >
            <DialogTitle id="max-width-dialog-title">Edit Transaction</DialogTitle>
            <DialogContent>
                <form noValidate autoComplete="off">
                    <FormControl>
                        <InputLabel htmlFor="heading">Title</InputLabel>
                        <Input id="heading" value={editedTransaction.heading} onChange={handleHeadingChange} autoFocus/>
                    </FormControl>
                    <FormControl>
                        <InputLabel htmlFor="amount">Amount</InputLabel>
                        <Input type="number" id="amount" value={editedTransaction.amount}
                               onChange={handleAmountChange}/>
                    </FormControl>
                    <FormControl>
                        <KeyboardDatePicker
                            style={{marginTop: '20px'}}
                            required
                            autoOk
                            variant="inline"
                            inputVariant="standard"
                            format="dd/MM/yyyy"
                            value={editedTransaction.date}
                            InputAdornmentProps={{position: 'start'}}
                            onChange={(date) => handleDateChange(date)}
                        />
                    </FormControl>
                    <FormControl component="fieldset" style={{marginTop: '20px'}}>
                        <FormLabel component="legend">Mode</FormLabel>
                        <RadioGroup
                            aria-label="Mode"
                            name="mode"
                            value={editedTransaction.mode}
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
                            value={editedTransaction.type || DEBIT_TYPE}
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
                    {
                        deleteLoading ? <Loader/> :
                            <StyledDeleteButton onClick={handleDeleteTransaction}>
                                Delete
                            </StyledDeleteButton>
                    }
                    {
                        editLoading ? <Loader/> :
                            <StyledEditButton onClick={handleEditTransaction}>
                                Edit
                            </StyledEditButton>
                    }
                </StyledButtonWrapper>
            </DialogContent>
        </Dialog>
    )
}

const StyledButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

const StyledDeleteButton = styled.button`
  background-color: #e51d1d;
  padding: 10px;
  border-radius: 5px;
  border: none;
  color: white;
  font-size: 18px;
  width: 30%;
`;
const StyledEditButton = styled.button`
  background-color: #3f51b5;
  padding: 10px;
  border-radius: 5px;
  color: white;
  font-size: 18px;
  width: 30%;
`;

export default EditTransactionModal;