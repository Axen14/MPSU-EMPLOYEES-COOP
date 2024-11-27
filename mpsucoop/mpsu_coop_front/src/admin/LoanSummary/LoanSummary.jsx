import React from 'react';
import './LoanSummary.css';

const loanTypes = [
  { type: 'BORROWERS', amount: '500,000', left: 'Active:', right: 'Paid-off:' },
  { type: 'NET TOTAL LOAN AMOUNT', amount: '500,000', left: 'Received:' },
  { type: 'LOANS', amount: '500,000', left: 'Active:', right: 'Fully-paid:' }
];

function LoanSummary() {
  return (
    <div className="loan-summary-container">
      {loanTypes.map((loan, index) => (
        <div key={index} className="loan-card">
          <h3 className="loans-type">{loan.type}</h3>
          <p className="loan-amount">{loan.amount}</p>
          {loan.left || loan.right ? (
            <div className="loan-details">
              {loan.left && <span className="loan-label">{loan.left}</span>}
              {loan.right && <span className="loan-label">{loan.right}</span>}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export default LoanSummary;
