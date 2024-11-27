import React, { useState } from 'react';

const Payments = () => {
  const [searchQuery, setSearchQuery] = useState('');  

  const data = [
    { date: '2024-09-03', accountNumber: '12345', orNumber: '67890', amount: '1000.00' },
    { date: '2024-09-02', accountNumber: '54321', orNumber: '09876', amount: '2000.00' },
  ];

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredData = data.filter(row =>
    row.date.toLowerCase().includes(searchQuery) ||
    row.accountNumber.toLowerCase().includes(searchQuery) ||
    row.orNumber.toLowerCase().includes(searchQuery) ||
    row.amount.toLowerCase().includes(searchQuery)
  );

  return (
    <div style={{ margin: '20px', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <section style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Payment</h1>
        </div>
      </section>

      <section>
        <div>
          <div style={{ width: '100%', backgroundColor: '#fff', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '20px', borderRadius: '8px' }}>
            <div style={{ marginBottom: '20px' }}>
              <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder="Find Something....."
                  style={{
                    width: '300px',
                    padding: '8px',
                    fontSize: '1rem',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    marginRight: '10px'
                  }}
                />
                <button type="submit" style={{
                  backgroundColor: '#007bff',
                  color: 'white',
                  padding: '8px 12px',
                  fontSize: '1rem',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}>
                  <i className="fas fa-search"></i>
                </button>
              </form>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>DATE</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>ACCOUNT NUMBER</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>OR NUMBER</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((row, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                      <td style={{ padding: '10px' }}>{row.date}</td>
                      <td style={{ padding: '10px' }}>{row.accountNumber}</td>
                      <td style={{ padding: '10px' }}>{row.orNumber}</td>
                      <td style={{ padding: '10px' }}>{row.amount}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '10px' }}>No results found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Payments;
