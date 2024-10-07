import React from 'react';
import './LoanSummary.css';
const loanTypes = ['REGULAR LOAN', 'BUSINESS LOAN', 'EMERGENCY LOAN', 'HOME LOAN'];

function LoanSummary() {
  return (
    <div className="loan">
      <div className="loanHeader">
        <h2 className="loanTitle">LOAN SUMMARY</h2>
      </div>
      <div className="loanList">
        {loanTypes.map((type, index) => (
          <div key={index} className="loanCard">
            <h3>{type}</h3>
            <p>500,000</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LoanSummary;

