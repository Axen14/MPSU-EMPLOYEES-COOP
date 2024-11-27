import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Account = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/accounts/');
        setAccounts(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '20px', fontSize: '18px' }}>Loading...</div>;
  if (error) return <div style={{ textAlign: 'center', color: 'red', padding: '20px', fontSize: '18px' }}>Error: {error.message}</div>;

  return (
    <div style={{fontFamily: 'Arial, sans-serif', margin: 0, margin: 0 }}>
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 style={{ fontSize: '40px', color: 'black', textAlign: 'left', marginTop: '70px' }}>Account</h1>
            </div>
          </div>
        </div>
      </section>
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="card" style={{ borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <div className="card-body">
                  <table id="example1" className="table table-bordered table-striped" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f1f1f1' }}>
                        <th style={{ padding: '10px', textAlign: 'left' }}>DATE</th>
                        <th style={{ padding: '10px', textAlign: 'left' }}>ACCOUNT NUMBER</th>
                        <th style={{ padding: '10px', textAlign: 'left' }}>LOAN TYPE</th>
                        <th style={{ padding: '10px', textAlign: 'left' }}>SHARE CAPITAL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {accounts.length > 0 ? (
                        accounts.map((account) => (
                          <tr key={account.account_number}>
                            <td style={{ padding: '10px', textAlign: 'left' }}>{new Date(account.loan_date).toLocaleDateString()}</td>
                            <td style={{ padding: '10px', textAlign: 'left' }}>{account.account_number}</td>
                            <td style={{ padding: '10px', textAlign: 'left' }}>{account.type}</td>
                            <td style={{ padding: '10px', textAlign: 'left' }}>
                              {account.shareCapital.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>No accounts found.</td>
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

export default Account;
