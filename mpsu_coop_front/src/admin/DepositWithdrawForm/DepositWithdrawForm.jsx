import React, { useState } from 'react';
import axios from 'axios';

function DepositWithdrawForm({ accountNumber, actionType, closeForm, setAccounts, setError }) {
  const [amount, setAmount] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const endpoint = actionType === 'deposit' 
        ? `http://localhost:8000/api/accounts/${accountNumber}/deposit/` 
        : `http://localhost:8000/api/accounts/${accountNumber}/withdraw/`;

      await axios.post(endpoint, { amount: parseFloat(amount) });
      const response = await axios.get('http://localhost:8000/api/accounts/');
      setAccounts(response.data); 
      closeForm(); 
    } catch (err) {
      setError(err); 
    }
  };

  return (
    <div>
      <h2>{actionType.charAt(0).toUpperCase() + actionType.slice(1)} Amount</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <button type="submit">{actionType.charAt(0).toUpperCase() + actionType.slice(1)}</button>
        <button type="button" onClick={closeForm}>Cancel</button>
      </form>
    </div>
  );
}

export default DepositWithdrawForm;
