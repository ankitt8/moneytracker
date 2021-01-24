import React from 'react';
import './App.css';
import AddTransaction from './components/AddTransaction';
import Transactions from './components/Transactions';
import TransactionSummary from './components/TransactionSummary';
function App() {
  return (
    <div>
      <TransactionSummary />
      <AddTransaction />
      <Transactions />
    </div>
  );
}

export default App;
