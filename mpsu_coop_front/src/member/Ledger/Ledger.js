import React from 'react';
import './Ledger.css';

const Ledger = () => {
  return (
    <div className="ledger-wrapper">
      <div className="ledger-table" id="ledgerTable">
        <h2>Ledger</h2>
        <div>
          <label>Loan Type:</label>
          <span>Regular</span>
        </div>
        <div>
          <label>Loan ID:</label>
          <span>58391</span>
        </div>
        <table>
          <caption>Overview of Loans, Payments, and Charges</caption>
          <thead>
            <tr>
              <th colSpan="2">LOANS</th>
              <th colSpan="5">PAYMENTS</th>
              <th colSpan="3">CHARGES</th>
            </tr>
            <tr>
              <th>DATE</th>
              <th>LOAN</th>
              <th>DATE</th>
              <th>OR #</th>
              <th>TYPE OF PAYMENT</th>
              <th>PAYMENT</th>
              <th>BALANCE</th>
              <th>INTEREST SERVICE</th>
              <th>SERVICE FEE</th>
              <th>PRINCIPAL FEE</th>
            </tr>
          </thead>
          <tbody>
            {/* Example row */}
            <tr>
              <td>2024-01-01</td>
              <td>$1,000.00</td>
              <td>2024-01-15</td>
              <td>123456</td>
              <td>Monthly Payment</td>
              <td>$100.00</td>
              <td>$900.00</td>
              <td>$5.00</td>
              <td>$2.00</td>
              <td>$3.00</td>
            </tr>
            {/* Add more rows as needed */}
          </tbody>
        </table>
        <button className="print-btn" onClick={() => window.print()}>Print</button>
      </div>
    </div>
  );
};

export default Ledger;
