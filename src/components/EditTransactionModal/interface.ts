import { TransactionInterface } from 'helper';

export interface EditTransactionModalProps {
    transaction: TransactionInterface
    open: boolean
    handleClose: () => void
}