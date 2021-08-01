import React from "react";
import "./styles.scss";
import { CreditDebitSummaryProps } from "./interface";

const CreditDebitSummary = ({
  title,
  creditAmount,
  debitAmount,
}: CreditDebitSummaryProps) => {
  return (
    <>
      <div className="credit-debit-summary">
        <p>{title}</p>
        <div className="summary">
          <p>{new Intl.NumberFormat("en-IN").format(creditAmount)}</p>
          <p>-</p>
          <p>{new Intl.NumberFormat("en-IN").format(debitAmount)}</p>
          <p>=</p>
          <p>
            {new Intl.NumberFormat("en-IN").format(creditAmount - debitAmount)}
          </p>
        </div>
      </div>
    </>
  );
};

export default CreditDebitSummary;
