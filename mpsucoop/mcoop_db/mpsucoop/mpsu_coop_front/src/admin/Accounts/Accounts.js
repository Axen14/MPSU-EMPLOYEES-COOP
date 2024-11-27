import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Accounts.css'; 
import DepositWithdrawForm from '../DepositWithdrawForm/DepositWithdrawForm';
// import AddAccountForm from './AddAccountForm';
import { FaPlus } from 'react-icons/fa';

function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);  
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [actionType, setActionType] = useState('');  
  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetchAccounts();
    fetchMembers();
  }, []);

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

  const fetchMembers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/members/');
      setMembers(response.data);
    } catch (err) {
      setError(err);
    }
  };

  // const handleAddAccount = async (newAccount) => {
  //   try {
  //     await axios.post('http://localhost:8000/accounts/', newAccount);
  //     fetchAccounts(); 
  //   } catch (err) {
  //     setError(err);
  //   }
  // };

  const handleDeleteAccount = async (account_number) => {
    try {
      await axios.delete(`http://localhost:8000/accounts/${account_number}/`);
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

  const getAccountHolderName = (accountHolderId) => {
    const member = members.find((member) => member.memId === accountHolderId);
    return member ? `${member.first_name} ${member.last_name}` : 'N/A';
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className={styles.accountsSection} style={{ width: '100%', border: '2px solid blue', background: 'white' }}>
      <div className={styles.tableHeader}>
        <h2 className={styles.accountsTitle} style={{ width: '50%', display: 'inline-block', flexGrow: '1' }}>
          ACCOUNTS
        </h2>
        {/* <button
          className={styles.addButton}
          onClick={() => openForm(null, 'add')}
          style={{ width: '10%', marginLeft: '250px', backgroundColor: '#41ac6a' }}
        >
          <FaPlus /> Add Account
        </button> */}
      </div>

      
      {!showForm && (
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
                <td>{getAccountHolderName(account.account_holder)}</td>
                <td>{account.shareCapital}</td>
                <td>{account.status}</td>
                <td>
                  <button onClick={() => handleDeleteAccount(account.account_number)}>Delete</button>
                  <button onClick={() => openForm(account, 'deposit')}>Deposit</button>
                  <button onClick={() => openForm(account, 'withdraw')}>Withdraw</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      
      {showForm && actionType !== 'add' && (
        <DepositWithdrawForm
          onClose={closeForm}
          account={selectedAccount}
          actionType={actionType}
          fetchAccounts={fetchAccounts}
          setError={setError}
          className={styles.formWrapper}  
        />
      )}
      
      {/* {showForm && actionType === 'add' && (
        <AddAccountForm
          onClose={closeForm}
          onAddAccount={handleAddAccount}
          members={members}
          className={styles.formWrapper}  
        />
      )} */}
    </div>
  );
}

export default Accounts;