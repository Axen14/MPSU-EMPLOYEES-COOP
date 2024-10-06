import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Accounts.css'; 
import DepositWithdrawForm from '../DepositWithdrawForm/DepositWithdrawForm'; 

function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false); 
  const [showAddForm, setShowAddForm] = useState(false); // State to manage the Add Account form
  const [selectedAccount, setSelectedAccount] = useState(null); 
  const [actionType, setActionType] = useState('');
  const [accountNumber, setAccountNumber] = useState(''); // New account number state
  const [accountHolder, setAccountHolder] = useState(1); // Adjust as necessary

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
    e.preventDefault(); // Prevent form submission

    const newAccount = {
      account_number: accountNumber,
      account_holder: accountHolder, // Ensure this ID exists in your system
      status: 'Active',
    };

    try {
      await axios.post('http://localhost:8000/api/accounts/', newAccount);
      const response = await axios.get('http://localhost:8000/api/accounts/');
      setAccounts(response.data);
      setShowAddForm(false); // Close the add form
      setAccountNumber(''); // Reset account number
      setAccountHolder(1); // Reset account holder
    } catch (err) {
      console.error(err.response.data); // Log error details
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className={styles.accountsSection} style={{ width: '100%', border: '2px solid blue', background: 'white' }}>
      <div className={styles.tableHeader}>
        <h2 className={styles.accountsTitle} style={{ width: '50%', display: 'inline-block', flexGrow: '1' }}>ACCOUNTS</h2>
        <button className={styles.addButton} onClick={() => setShowAddForm(true)} style={{ width: '10%', marginLeft: '250px', backgroundColor: '#41ac6a' }}>Add Account</button>
      </div>
      <table className={styles.accountsTable} style={{ border: '2px solid #000', width: '100%' }}>
        <thead style={{ border: '2px solid #000' }}>
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
            <tr key={account.account_number} style={{ textAlign: 'center' }}>
              <td>{account.account_number}</td>
              <td>{account.account_holder ? `${account.account_holder.first_name} ${account.account_holder.last_name}` : 'N/A'}</td>
              <td>{account.shareCapital}</td>
              <td>{account.status}</td>
              <td>
                <button onClick={() => handleDeleteAccount(account.account_number)}>Delete</button>
                <button onClick={() => openForm(account.account_number, 'deposit')}>Deposit</button>
                <button onClick={() => openForm(account.account_number, 'withdraw')}>Withdraw</button>
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
        <div style={{ marginTop: '20px', border: '1px solid #000', padding: '20px', background: '#f9f9f9' }}>
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
              />
            </div>
            <button type="submit">Add Account</button>
            <button type="button" onClick={() => setShowAddForm(false)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Accounts;
