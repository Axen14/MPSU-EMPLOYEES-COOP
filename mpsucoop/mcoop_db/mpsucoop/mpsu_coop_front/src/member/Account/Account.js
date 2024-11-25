import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import './Account.css';

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

  if (loading) return <div>Loading...</div>; 
  if (error) return <div>Error: {error.message}</div>; 

  return (
    <div className="content-wrapper">
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Account</h1>
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
                  <table id="example1" className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>DATE</th>
                        <th>ACCOUNT NUMBER</th>
                        <th>LOAN TYPE</th>
                        <th>SHARE CAPITAL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {accounts.length > 0 ? (
                        accounts.map((account) => (
                          <tr key={account.account_number}>
                            <td>{new Date(account.loan_date).toLocaleDateString()}</td> 
                            <td>{account.account_number}</td>
                            <td>{account.type}</td> 
                            <td>{account.shareCapital.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td> 
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4">No accounts found.</td>
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
