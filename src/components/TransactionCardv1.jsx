import React from 'react';
export default function TransactionCard({ heading, amount }) {
  return (
    <div className="transaction-card">
      <h3>{heading}</h3>
      <h3>{amount}</h3>
    </div>
  );
}