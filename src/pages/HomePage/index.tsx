import React from 'react'
import SnackBarFeedback from 'components/FeedBack'
import Transactions from 'components/Transactions'
import TransactionSummary from 'components/TransactionSummary'
const HomePage = ({userId}: {userId: string}) => {
    return (
        <div className='desktop-view'>
            <TransactionSummary />
            <Transactions userId={userId} />
            <SnackBarFeedback />
        </div>
    )
}

export default HomePage

