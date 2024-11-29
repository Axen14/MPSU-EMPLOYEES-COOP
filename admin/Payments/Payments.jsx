import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Payments.css';

const Payments = () => {
  const [paymentSchedules, setPaymentSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState(null); 

  const fetchPaymentSchedules = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:8000/payment-schedules/');
      setPaymentSchedules(response.data);
    } catch (err) {
      setError('Failed to fetch payment schedules. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentSchedules();
  }, []);

  const paidSchedules = paymentSchedules.filter(schedule => schedule.is_paid);

  const handleScheduleClick = (schedule) => {
    setSelectedSchedule(schedule);
  };

  const handleBackToList = () => {
    setSelectedSchedule(null);
  };

  return (
    <div className="payments-container">
      {!selectedSchedule ? (
        <>
          <h2>Paid Payment Schedules</h2>
          {loading && <p>Loading payment schedules...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}

          {paidSchedules.length > 0 ? (
            <table className="payments-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Account Number</th>
                  {/* <th>Status</th> */}
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {paidSchedules.map((schedule) => (
                  <tr key={schedule.id} onClick={() => handleScheduleClick(schedule)}>
                    <td>{schedule.account_holder?.name || 'N/A'}</td>
                    <td>{schedule.account_number || 'N/A'}</td>
                    {/* <td style={{ color: 'green' }}>{schedule.is_paid ? 'Paid' : 'Pending'}</td> */}
                    <td>{schedule.payment_date || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No paid payment schedules available.</p>
          )}
        </>
      ) : (
        <div className="payment-schedule-details">
          <button onClick={handleBackToList}>Back to List</button>
          <h3>Payment Details For:</h3>
          <p>
            <strong>Name:</strong> {selectedSchedule.account_holder?.name || 'N/A'}
          </p>
          <p>
            <strong>Account Number:</strong> {selectedSchedule.account_number || 'N/A'}
          </p>

          <table className="payments-table">
            <thead>
              <tr>
                <th>Principal Amount</th>
                <th>Interest Amount</th>
                <th>Paid Balance</th>
                <th>Date</th>
                <th>Balance</th>
                {/* <th>Status</th> */}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>₱ {Number(selectedSchedule.principal_amount).toFixed(2)}</td>
                <td>₱ {Number(selectedSchedule.interest_amount).toFixed(2)}</td>
                <td>₱ {Number(selectedSchedule.payment_amount).toFixed(2)}</td>
                <td>{new Date(selectedSchedule.due_date).toLocaleDateString()}</td>
                <td>₱ {Number(selectedSchedule.balance).toFixed(2)}</td>
                {/* <td style={{ color: 'green' }}>{selectedSchedule.is_paid ? 'Paid' : 'Pending'}</td> */}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Payments;
