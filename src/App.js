import React from 'react';
import './App.css';
import AddTransaction from './components/AddTransaction';
import SnackBarFeedback from './components/SnackBarFeedback';
import Transactions from './components/Transactions';
import TransactionSummary from './components/TransactionSummary';
function App() {
  return (
    <div>
      <TransactionSummary />
      <AddTransaction />
      <Transactions />
      <SnackBarFeedback />
    </div>
  );
}

export default App;
