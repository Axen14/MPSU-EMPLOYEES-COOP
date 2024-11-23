import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {AiOutlineUsergroupAdd} from "react-icons/ai";

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
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'left', color: 'black' }}>Payment Records</h2>

      {!showAddPaymentForm && (
        <>
          {loading && <p style={{ textAlign: 'center', color: '#666' }}>Loading payments...</p>}
          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
          
          <button
            onClick={() => setShowAddPaymentForm(true)}
            style={{
              display: 'block',
              margin: '20px auto',
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'black',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginLeft: '86%',
            }}
          >
            <AiOutlineUsergroupAdd />Add Payment
          </button>

          {payments.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
              <thead>
                <tr>
                  <th style={{ border: '2px solid black', padding: '10px', backgroundColor: '#f9f9f9' }}>Payment ID</th>
                  <th style={{ border: '2px solid black', padding: '10px', backgroundColor: '#f9f9f9' }}>Loan Number</th>
                  <th style={{ border: '2px solid black', padding: '10px', backgroundColor: '#f9f9f9' }}>Payment Amount</th>
                  <th style={{ border: '2px solid black', padding: '10px', backgroundColor: '#f9f9f9' }}>Payment Date</th>
                  <th style={{ border: '2px solid black', padding: '10px', backgroundColor: '#f9f9f9' }}>Payment Method</th>
                  <th style={{ border: '2px solid black', padding: '10px', backgroundColor: '#f9f9f9' }}>Penalty</th>
                  <th style={{ border: '2px solid black', padding: '10px', backgroundColor: '#f9f9f9' }}>Admin Cost</th>
                  <th style={{ border: '2px solid black', padding: '10px', backgroundColor: '#f9f9f9' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.OR} style={{ textAlign: 'center', borderBottom: '2px solid black' }}>
                    <td style={{ padding: '10px' }}>{payment.OR}</td>
                    <td style={{ padding: '10px' }}>{payment.loan ? payment.loan.control_number : 'N/A'}</td>
                    <td style={{ padding: '10px' }}>{Number(payment.payment_amount).toFixed(2)}</td>
                    <td style={{ padding: '10px' }}>{new Date(payment.payment_date).toLocaleDateString()}</td>
                    <td style={{ padding: '10px' }}>{payment.method}</td>
                    <td style={{ padding: '10px' }}>{Number(payment.penalty).toFixed(2)}</td>
                    <td style={{ padding: '10px' }}>{Number(payment.admin_cost).toFixed(2)}</td>
                    <td style={{ padding: '10px' }}>{payment.status || 'Pending'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ textAlign: 'center', color: '#666' }}>No payment records available.</p>
          )}
        </>
      )}

      {showAddPaymentForm && (
        <>
          <h3 style={{ textAlign: 'left', marginBottom: '20px' }}>Enter Account Number</h3>
          <form onSubmit={handleAccountSubmit} style={{ textAlign: 'center', marginBottom: '20px' }}>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="Account Number"
              required
              style={{
                padding: '10px',
                marginRight: '10px',
                borderRadius: '5px',
                border: '2px solid black',
              }}
            />
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                backgroundColor: '#4CAF50',
                color: 'black',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Check Active Loans
            </button>
          </form>

          {loans.length > 0 && (
            <>
              <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Select a Loan</h3>
              <div style={{ textAlign: 'center' }}>
                {loans.map((loan) => (
                  <button
                    key={loan.control_number}
                    onClick={() => fetchPaymentSchedules(loan.control_number)}
                    style={{
                      display: 'inline-block',
                      margin: '5px',
                      padding: '10px 20px',
                      backgroundColor: '#2196F3',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}
                  >
                    Loan #{loan.control_number} (Due: {loan.due_date})
                  </button>
                ))}
              </div>
            </>
          )}

          {paymentSchedules.length > 0 && (
            <>
              <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Payment Schedules for Loan #{selectedLoan}</h3>
              <ul style={{ listStyle: 'none', paddingLeft: '0', textAlign: 'center' }}>
                {paymentSchedules.map((schedule) => (
                  <li key={schedule.id} style={{ marginBottom: '10px' }}>
                    <label style={{ fontSize: '16px' }}>
                      <input
                        type="radio"
                        name="schedule"
                        value={schedule.id}
                        onChange={() => setSelectedSchedule(schedule.id)}
                        style={{ marginRight: '10px' }}
                      />
                      Due: {new Date(schedule.due_date).toLocaleDateString()} - Amount: {schedule.payment_amount.toFixed(2)}
                    </label>
                  </li>
                ))}
              </ul>
              <button
                onClick={handlePaymentSubmit}
                style={{
                  display: 'block',
                  margin: '20px auto',
                  padding: '10px 20px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                Submit Payment
              </button>
            </>
          )}

          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
          {successMessage && <p style={{ color: 'green', textAlign: 'center' }}>{successMessage}</p>}
        </>
      )}
    </div>
  );
};

export default Payments;
