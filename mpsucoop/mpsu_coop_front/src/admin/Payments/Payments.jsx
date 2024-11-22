import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Payments.css';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

 
  const [showAddPaymentForm, setShowAddPaymentForm] = useState(false);
  const [accountNumber, setAccountNumber] = useState('');
  const [loans, setLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [paymentSchedules, setPaymentSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  
  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:8000/payments/');
      setPayments(response.data);
    } catch (err) {
      setError('Failed to fetch payments. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    fetchPayments();
  }, []);

 
  const handleAccountSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoans([]);
    setPaymentSchedules([]);
    setSelectedLoan(null);

    try {
  
      const response = await axios.get(`http://127.0.0.1:8000/accounts/${accountNumber}/active-loans/`);
      
      if (response.data.active_loans.length > 0) {
        setLoans(response.data.active_loans); 
      } else {
        setError('No active loans found for this account number.');
      }
    } catch (err) {
      setError('Failed to fetch loans. Please check the account number and try again.');
    }
  };


  const fetchPaymentSchedules = async (controlNumber) => {
    setError('');
    try {
      const response = await axios.get(`http://127.0.0.1:8000/loans/${controlNumber}/payment-schedules/`);
      setPaymentSchedules(response.data);
      setSelectedLoan(controlNumber);
    } catch (err) {
      setError('Failed to fetch payment schedules.');
    }
  };

  
  const handlePaymentSubmit = async () => {
    setError('');
    setSuccessMessage('');

    if (!selectedSchedule) {
      setError('Please select a payment schedule.');
      return;
    }

    try {
      const paymentData = {
        loan: selectedLoan,
        payment_schedule: selectedSchedule,
      };

      const response = await axios.post('http://127.0.0.1:8000/payments/', paymentData);

      if (response.status === 201) {
        setSuccessMessage('Payment recorded successfully!');
        fetchPayments();
  
        setShowAddPaymentForm(false);
        setAccountNumber('');
        setLoans([]);
        setPaymentSchedules([]);
        setSelectedLoan(null);
      }
    } catch (err) {
      setError('Failed to create payment. Please try again.');
    }
  };

  return (
    <div className="payments-container">
      <h2>Payment Records</h2>

  
      {!showAddPaymentForm && (
        <>
          {loading && <p>Loading payments...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          
          <button onClick={() => setShowAddPaymentForm(true)}>Add Payment</button>
          
          {payments.length > 0 ? (
            <table className="payments-table">
              <thead>
                <tr>
                  <th>Payment ID</th>
                  <th>Loan Number</th>
                  <th>Payment Amount</th>
                  <th>Payment Date</th>
                  <th>Payment Method</th>
                  <th>Penalty</th>
                  <th>Admin Cost</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.OR}>
                    <td>{payment.OR}</td>
                    <td>{payment.loan ? payment.loan.control_number : 'N/A'}</td>
                    <td>{Number(payment.payment_amount).toFixed(2)}</td>
                    <td>{new Date(payment.payment_date).toLocaleDateString()}</td>
                    <td>{payment.method}</td>
                    <td>{Number(payment.penalty).toFixed(2)}</td>
                    <td>{Number(payment.admin_cost).toFixed(2)}</td>
                    <td>{payment.status || 'Pending'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No payment records available.</p>
          )}
        </>
      )}

      
      {showAddPaymentForm && (
        <>
          <h3>Enter Account Number</h3>
          <form onSubmit={handleAccountSubmit}>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="Account Number"
              required
            />
            <button type="submit">Check Active Loans</button>
          </form>

         
          {loans.length > 0 && (
            <>
              <h3>Select a Loan</h3>
              {loans.map((loan) => (
                <button key={loan.control_number} onClick={() => fetchPaymentSchedules(loan.control_number)}>
                  Loan #{loan.control_number} (Due: {loan.due_date})
                </button>
              ))}
            </>
          )}

         
          {paymentSchedules.length > 0 && (
            <>
              <h3>Payment Schedules for Loan #{selectedLoan}</h3>
              <ul>
                {paymentSchedules.map((schedule) => (
                  <li key={schedule.id}>
                    <label>
                      <input
                        type="radio"
                        name="schedule"
                        value={schedule.id}
                        onChange={() => setSelectedSchedule(schedule.id)}
                      />
                      Due: {new Date(schedule.due_date).toLocaleDateString()} - Amount: {schedule.payment_amount.toFixed(2)}
                    </label>
                  </li>
                ))}
              </ul>
              <button onClick={handlePaymentSubmit}>Submit Payment</button>
            </>
          )}

          {error && <p style={{ color: 'red' }}>{error}</p>}
          {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        </>
      )}
    </div>
  );
};

export default Payments;
