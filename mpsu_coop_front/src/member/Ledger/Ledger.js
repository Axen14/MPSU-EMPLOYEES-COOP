import React from 'react';
import './Ledger.css';

const Ledger = () => {
  return (
    <div className="content-wrapper">
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
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
        <button className="print-btn" onClick={() => window.print()}>Print</button>
      </div>
    </div>
  );
};

export default Ledger;
