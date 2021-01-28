import React from 'react';
import './App.css';
import SnackBarFeedback from './components/SnackBarFeedback';
import Transactions from './components/Transactions';
import TransactionSummary from './components/TransactionSummary';
import QuoteAndAddIcon from './components/QuoteAndAddIcon'
function App() {
  return (
    <div>
      <TransactionSummary />
      <QuoteAndAddIcon />
      <Transactions />
      <SnackBarFeedback />
    </div>
  );
}

export default App;
