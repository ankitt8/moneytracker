import React from 'react';
import './App.css';
import AddTransaction from './components/AddTransaction';
import Transactions from './components/Transactions';
function App() {
  return (
    <div>
      <AddTransaction />
      <Transactions />
    </div>
  );
}

export default App;
