import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Accounts.css';
import DepositWithdrawForm from '../DepositWithdrawForm/DepositWithdrawForm'; 

function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false); 
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null); 
  const [actionType, setActionType] = useState('');
  const [accountNumber, setAccountNumber] = useState(''); 
  const [accountHolder, setAccountHolder] = useState(1); 
  const [shareCapital, setShareCapital] = useState(0); // New state for Share Capital
  const [status, setStatus] = useState('Active'); // New state for Status

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/accounts/');
        setAccounts(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  const handleAddAccount = async (e) => {
    e.preventDefault(); 

    const newAccount = {
      account_number: accountNumber,
      account_holder: accountHolder,
      shareCapital: shareCapital, // Include Share Capital
      status: status, // Include Status
    };

    try {
      await axios.post('http://localhost:8000/api/accounts/', newAccount);
      const response = await axios.get('http://localhost:8000/api/accounts/');
      setAccounts(response.data);
      setShowAddForm(false); 
      setAccountNumber(''); 
      setAccountHolder(1); 
      setShareCapital(0); // Reset Share Capital
      setStatus('Active'); // Reset Status
    } catch (err) {
      console.error(err.response.data); 
      setError(err);
    }
  };

  const handleDeleteAccount = async (account_number) => {
    try {
      await axios.delete(`http://localhost:8000/api/accounts/${account_number}/`);
      setAccounts(accounts.filter(account => account.account_number !== account_number));
    } catch (err) {
      setError(err);
    }
  };

  const openForm = (account, type) => {
    setSelectedAccount(account);
    setActionType(type);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedAccount(null);
    setActionType('');
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;

  return (
    <div className="accounts-section">
      <div className="table-header">
        <h2 className="accounts-title">ACCOUNTS</h2>
        <button className="add-button" onClick={() => setShowAddForm(true)}>Add Account</button>
      </div>
      <table className="accounts-table">
        <thead>
          <tr>
            <th>Account Number</th>
            <th>Account Holder</th>
            <th>Share Capital</th>
            <th>Status</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => (
            <tr key={account.account_number}>
              <td>{account.account_number}</td>
              <td>{account.account_holder ? `${account.account_holder.first_name} ${account.account_holder.last_name}` : 'N/A'}</td>
              <td>{account.shareCapital}</td>
              <td>{account.status}</td>
              <td>
                <button className="delete-button" onClick={() => handleDeleteAccount(account.account_number)}>Delete</button>
                <button className="deposit-button" onClick={() => openForm(account.account_number, 'deposit')}>Deposit</button>
                <button className="withdraw-button" onClick={() => openForm(account.account_number, 'withdraw')}>Withdraw</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <DepositWithdrawForm
          accountNumber={selectedAccount}
          actionType={actionType}
          closeForm={closeForm}
          setAccounts={setAccounts}
          setError={setError}
        />
      )}

      {showAddForm && (
        <div className="add-account-form">
          <h3>Add New Account</h3>
          <form onSubmit={handleAddAccount}>
            <div>
              <label>Account Number:</label>
              <input
                type="text"
                placeholder="Account Number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                required
                className="input-field"
              />
            </div>
            <div>
              <label>Account Holder ID:</label>
              <input
                type="number"
                placeholder="Account Holder ID"
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
                required
                className="input-field"
              />
            </div>
            <div>
              <label>Share Capital:</label>
              <input
                type="number"
                placeholder="Share Capital"
                value={shareCapital}
                onChange={(e) => setShareCapital(e.target.value)}
                required
                className="input-field"
              />
            </div>
            <div>
              <label>Status:</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
                className="input-field"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            <button type="submit" className="submit-button">Add Account</button>
            <button type="button" className="cancel-button" onClick={() => setShowAddForm(false)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Accounts;
