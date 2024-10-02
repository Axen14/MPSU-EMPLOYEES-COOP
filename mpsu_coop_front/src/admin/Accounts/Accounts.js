import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Accounts.css'; 
import DepositWithdrawForm from '../DepositWithdrawForm/DepositWithdrawForm'; 

function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false); 
  const [selectedAccount, setSelectedAccount] = useState(null); 
  const [actionType, setActionType] = useState('');

  
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

  
  const handleAddAccount = async () => {
    const newAccount = {
      account_number: 'NEW_ACCOUNT_NUMBER', 
      account_holder: 1, 
      status: 'Active',
    };

    try {
      await axios.post('http://localhost:8000/api/accounts/', newAccount);
      const response = await axios.get('http://localhost:8000/api/accounts/');
      setAccounts(response.data);
    } catch (err) {
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
        <button className={styles.addButton} onClick={handleAddAccount} style={{ width: '10%', marginLeft: '250px', backgroundColor: '#41ac6a' }}>Add</button>
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
                {/* <button onClick={() => handleEditAccount(account.account_number)}>Edit</button> */}
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
    </div>
  );
}

export default Accounts;
