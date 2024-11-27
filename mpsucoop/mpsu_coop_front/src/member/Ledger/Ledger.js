import React from 'react';

const Ledger = () => {
  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
  };

  const thStyle = {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '10px',
    textAlign: 'center',
  };

  const tdStyle = {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'center',
  };

  const labelStyle = {
    fontWeight: 'bold',
  };

  const spanStyle = {
    marginLeft: '10px',
  };

  const buttonStyle = {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '20px',
    fontSize: '1rem',
    transition: 'background-color 0.3s',
  };

  const buttonHoverStyle = {
    backgroundColor: '#0056b3',
  };

  return (
    <div className="content-wrapper" style={{ maxWidth: '1200px', margin: '20px auto', padding: '20px' }}>
      <div className="ledger-table" id="ledgerTable">
        <h2>Ledger</h2>
        <div>
          <label style={labelStyle}>Loan Type:</label>
          <span style={spanStyle}>Regular</span>
        </div>
        <div>
          <label style={labelStyle}>Loan ID:</label>
          <span style={spanStyle}>58391</span>
        </div>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th colSpan="2" style={thStyle}>LOANS</th>
              <th colSpan="5" style={thStyle}>PAYMENTS</th>
              <th colSpan="3" style={thStyle}>CHARGES</th>
            </tr>
            <tr>
              <th style={thStyle}>DATE</th>
              <th style={thStyle}>LOAN</th>
              <th style={thStyle}>DATE</th>
              <th style={thStyle}>OR #</th>
              <th style={thStyle}>TYPE OF PAYMENT</th>
              <th style={thStyle}>PAYMENT</th>
              <th style={thStyle}>BALANCE</th>
              <th style={thStyle}>INTEREST SERVICE</th>
              <th style={thStyle}>SERVICE FEE</th>
              <th style={thStyle}>PRINCIPAL FEE</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tdStyle}></td>
              <td style={tdStyle}></td>
              <td style={tdStyle}></td>
              <td style={tdStyle}></td>
              <td style={tdStyle}></td>
              <td style={tdStyle}></td>
              <td style={tdStyle}></td>
              <td style={tdStyle}></td>
              <td style={tdStyle}></td>
              <td style={tdStyle}></td>
            </tr>
            <tr>
              <td style={tdStyle}></td>
              <td style={tdStyle}></td>
              <td style={tdStyle}></td>
              <td style={tdStyle}></td>
              <td style={tdStyle}></td>
              <td style={tdStyle}></td>
              <td style={tdStyle}></td>
              <td style={tdStyle}></td>
              <td style={tdStyle}></td>
              <td style={tdStyle}></td>
            </tr>
          </tbody>
        </table>
        <button
          className="print-btn"
          style={buttonStyle}
          onMouseOver={(e) => e.target.style.backgroundColor = buttonHoverStyle.backgroundColor}
          onMouseOut={(e) => e.target.style.backgroundColor = buttonStyle.backgroundColor}
          onClick={() => window.print()}
        >
          Print
        </button>
      </div>
    </div>
  );
};

export default Ledger;
