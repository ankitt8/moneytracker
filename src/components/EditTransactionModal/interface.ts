import { TransactionInterface } from 'helper';

export interface EditTransactionModalProps {
    transaction: TransactionInterface
    handleClose: () => void
}