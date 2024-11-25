import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PaymentSchedule = () => {
  const [accountSummaries, setAccountSummaries] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [accountDetails, setAccountDetails] = useState(null);

  const fetchAccountSummaries = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://127.0.0.1:8000/payment-schedules/summaries/');
      setAccountSummaries(response.data);
    } catch (err) {
      console.error('Error fetching account summaries:', err);
      setError('Failed to fetch account summaries.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentSchedules = async (accountNumber) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/payment-schedules/?account_number=${accountNumber}`
      );
      setSchedules(response.data);
      setSelectedAccount(accountNumber);

 
      const memberResponse = await axios.get(
        `http://127.0.0.1:8000/members/?account_number=${accountNumber}`
      );
      setAccountDetails(memberResponse.data[0]);
    } catch (err) {
      console.error('Error fetching schedules or account details:', err.response ? err.response.data : err.message);
      setError('Failed to fetch payment schedules or account details.');
    } finally {
      setLoading(false);
    }
  };

  const markAsPaid = async (schedule) => {
    setLoading(true);
    try {
      if (!schedule.id) {
        console.error('Schedule ID is undefined');
        return;
      }
      await axios.post(`http://127.0.0.1:8000/payment-schedules/${schedule.id}/mark-paid/`
    );

      setSchedules((prevSchedules) =>
        prevSchedules.map((s) =>
          s.id === schedule.id ? { ...s, is_paid: true, status: 'Paid' } : s
        )
      );

    } catch (err) {
      console.error('Error marking schedule as paid:', err.response ? err.response.data : err.message);
      setError('Failed to mark schedule as paid.');
    } finally {
      setLoading(false);
    }
  };

  const calculateRemainingBalance = () => {
    return schedules.reduce((total, schedule) => {
      if (!schedule.is_paid || schedule.status === 'Pending') {
        return total + parseFloat(schedule.balance || 0);
      }
      return total;
    }, 0).toFixed(2);
  };

  useEffect(() => {
    fetchAccountSummaries();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="payment-schedule-container">
      {!selectedAccount ? (
        <>
          <h2>Ongoing Payment Schedules</h2>
          {accountSummaries.length > 0 ? (
            <table className="account-summary-table">
              <thead>
                <tr>
                  <th>Account Number</th>
                  <th>Next Due Date</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tbody>
                {accountSummaries.map((summary, index) => (
                  <tr
                    key={`${summary.account_number}-${index}`}
                    onClick={() => fetchPaymentSchedules(summary.account_number)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>{summary.account_number || 'N/A'}</td>
                    <td>{summary.next_due_date ? new Date(summary.next_due_date).toLocaleDateString() : 'No Due Date'}</td>
                    <td>₱ {summary.total_balance?.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No ongoing schedules found.</p>
          )}
        </>
      ) : (
        <>
          <button onClick={() => setSelectedAccount(null)}>Back to List</button>
          {accountDetails && (
            <>
              <h3>Payment Schedule For:</h3>
              <p><strong>Name:</strong> {accountDetails.first_name} {accountDetails.last_name}</p>
              <p><strong>Account Number:</strong> {selectedAccount}</p>
              <p><strong>Remaining Balance:</strong> ₱ {calculateRemainingBalance()}</p>
            </>
          )}

          {schedules.length > 0 ? (
            <table className="payment-schedule-table">
              <thead>
                <tr>
                  <th>Principal Amount</th>
                  <th>Interest Amount</th>
                  <th>Payment Amount</th>
                  <th>Due Date</th>
                  <th>Balance</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((schedule, index) => (
                  <tr key={`${schedule.loan}-${schedule.due_date}-${index}`}>
                    <td>₱ {(parseFloat(schedule.principal_amount) || 0).toFixed(2)}</td>
                    <td>₱ {(parseFloat(schedule.interest_amount) || 0).toFixed(2)}</td>
                    <td>₱ {(parseFloat(schedule.payment_amount) || 0).toFixed(2)}</td>
                    <td>{new Date(schedule.due_date).toLocaleDateString()}</td>
                    <td>₱ {(parseFloat(schedule.balance) || 0).toFixed(2)}</td>
                    <td style={{ color: schedule.is_paid ? 'green' : 'red' }}>
                      {schedule.is_paid ? 'Paid' : 'Pending'}
                    </td>
                    <td>
                      {!schedule.is_paid && (
                        <button onClick={() => markAsPaid(schedule)}>Pay</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No payment schedules found for this account.</p>
          )}
        </>
      )}
    </div>
  );
};

export default PaymentSchedule;
