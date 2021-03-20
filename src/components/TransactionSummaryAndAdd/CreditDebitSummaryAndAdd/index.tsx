import React, { useState, lazy } from 'react';
import './styles.scss';
import { CREDIT_TYPE, DEBIT_TYPE } from 'Constants';
import { CreditDebitSummaryAndAddProps } from './interface';

const AddTransactionModal = lazy(() => import('components/AddTransactionModal'));

const CreditDebitSummaryAndAdd: React.FC<CreditDebitSummaryAndAddProps> = ({
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
			{open && <AddTransactionModal
				modalTitle={addTransactionModalTitle}
				userId={userId}
				type={type}
				mode={mode}
				handleClose={handleClose}
			/>}
		</>

	)
}

export default CreditDebitSummaryAndAdd;