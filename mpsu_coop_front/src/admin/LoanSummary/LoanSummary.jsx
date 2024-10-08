import React from 'react';
import './LoanSummary.css';

const loanTypes = [
  { name: 'REGULAR LOAN', amount: 500000 },
  { name: 'BUSINESS LOAN', amount: 300000 },
  { name: 'EMERGENCY LOAN', amount: 200000 },
  { name: 'HOME LOAN', amount: 750000 },
];

function LoanSummary() {
  return (
    <div className="loan">
      <div className="loanHeader">
        <h2 className="loanTitle">LOAN SUMMARY</h2>
      </div>
      <section className="loanList">
        {loanTypes.map((loan, index) => (
          <div key={index} className="loanCard">
            <h3>{loan.name}</h3>
            <p>{loan.amount.toLocaleString()}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

export default LoanSummary;
