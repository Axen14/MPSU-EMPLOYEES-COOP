
import './Payments.css';
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
    <div className="content-wrapper">
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Payment</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <form className="search-form" onSubmit={(e) => e.preventDefault()}>
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Find Something....."
                      value={searchQuery}
                      onChange={handleSearch}
                    />
                    <button type="submit" className="search-button">
                      <i className="fas fa-search"></i>
                    </button>
                  </form>
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>DATE</th>
                        <th>ACCOUNT NUMBER</th>
                        <th>OR NUMBER</th>
                        <th>AMOUNT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.length > 0 ? (
                        filteredData.map((row, index) => (
                          <tr key={index}>
                            <td>{row.date}</td>
                            <td>{row.accountNumber}</td>
                            <td>{row.orNumber}</td>
                            <td>{row.amount}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4">No results found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Payments;
