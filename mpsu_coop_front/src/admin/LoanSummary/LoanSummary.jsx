import React from 'react';
import styles from './LoanSummary.css';

const loanTypes = ['REGULAR LOAN', 'REGULAR LOAN', 'REGULAR LOAN','REGULAR LOAN'];

function LoanSummary() {
  return (
    <div className="loanSummary">
      
        {loanTypes.map((type, index) => (
          <div key={index} className={styles.loanCard} style={{ display: 'inline-block', backgroundColor:'rgb(0, 110, 255', borderRadius: '10px'}}>
            <h3 className={styles.loanType}>{type}</h3>
            <p className={styles.loanAmount}>500,000</p>
          </div>
        ))}
      
    </div>
  );
}

export default LoanSummary;
