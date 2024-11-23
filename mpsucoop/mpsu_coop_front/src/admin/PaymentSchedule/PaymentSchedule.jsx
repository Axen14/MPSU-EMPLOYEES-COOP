import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IoArrowBackCircleSharp } from "react-icons/io5";

const PaymentSchedule = () => {
  const [accountSummaries, setAccountSummaries] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const uniqueSchedules = schedules.filter((schedule, index, self) => 
    index === self.findIndex((s) => (
      s.loan === schedule.loan && s.due_date === schedule.due_date
    ))
  );

  const fetchPaymentSchedules = async (accountNumber) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/payment-schedules/?account_number=${accountNumber}`
      );
      setSchedules(response.data);
      setSelectedAccount(accountNumber);
    } catch (err) {
      console.error('Error fetching schedules:', err.response ? err.response.data : err.message);
      setError('Failed to fetch payment schedules.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountSummaries();
  }, []);

  if (loading) return <p style={{ textAlign: 'center', fontSize: '16px', fontStyle: 'italic' }}>Loading...</p>;
  if (error) return <p style={{ color: 'red', textAlign: 'center', fontWeight: 'bold' }}>{error}</p>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', color: 'black' }}>
      {!selectedAccount ? (
        <>
          <h2 style={{ textAlign: 'left', marginBottom: '20px' }}>Ongoing Payment Schedules</h2>
          {accountSummaries.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
              <thead>
                <tr style={{ backgroundColor: 'gray', textAlign: 'left' }}>
                  <th style={{ border: '2px solid black', padding: '10px' }}>Account Number</th>
                  <th style={{ border: '2px solid black', padding: '10px' }}>Next Due Date</th>
                  <th style={{ border: '2px solid black', padding: '10px' }}>Balance</th>
                </tr>
            </thead>
              <tbody>
                {accountSummaries.map((summary, index) => (
                  <tr
                    key={`${summary.account_number}-${index}`}
                    onClick={() => fetchPaymentSchedules(summary.account_number)}
                    style={{ cursor: 'pointer', backgroundColor: index % 2 === 0 ? 'gray' : '#f9f9f9' }}
                  >
                    <td style={{ border: '2px solid black', padding: '10px' }}>{summary.account_number || 'N/A'}</td>
                    <td style={{ border: '2px solid black', padding: '10px' }}>
                      {summary.next_due_date ? new Date(summary.next_due_date).toLocaleDateString() : 'No Due Date'}
                    </td>
                    <td style={{ border: '2px solid black', padding: '10px' }}>₱ {summary.total_balance?.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ textAlign: 'left', color: 'black' }}>No ongoing schedules found.</p>
          )}
        </>
      ) : (
        <>
          <button
            onClick={() => setSelectedAccount(null)}
            style={{
              marginBottom: '20px',
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'black',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            <IoArrowBackCircleSharp />Back to List
          </button>
          <h2 style={{ textAlign: 'left', marginBottom: '20px' }}>
            Payment Schedule for Account: {selectedAccount}
          </h2>
          {schedules.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
                  <th style={{ border: '2px solid black', padding: '10px' }}>Loan Number</th>
                  <th style={{ border: '2px solid black', padding: '10px' }}>Principal Amount</th>
                  <th style={{ border: '2px solid black', padding: '10px' }}>Interest Amount</th>
                  <th style={{ border: '2px solid black', padding: '10px' }}>Payment Amount</th>
                  <th style={{ border: '2px solid black', padding: '10px' }}>Due Date</th>
                  <th style={{ border: '2px solid black', padding: '10px' }}>Balance</th>
                  <th style={{ border: '2px solid black', padding: '10px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {uniqueSchedules.map((schedule, index) => (
                  <tr
                    key={`${schedule.loan}-${schedule.due_date}-${index}`}
                    style={{ backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9' }}
                  >
                    <td style={{ border: '2px solid black', padding: '10px' }}>{schedule.loan}</td>
                    <td style={{ border: '2px solid black', padding: '10px' }}>
                      ₱ {(parseFloat(schedule.principal_amount) || 0).toFixed(2)}
                    </td>
                    <td style={{ border: '2px solid black', padding: '10px' }}>
                      ₱ {(parseFloat(schedule.interest_amount) || 0).toFixed(2)}
                    </td>
                    <td style={{ border: '2px solid black', padding: '10px' }}>
                      ₱ {(parseFloat(schedule.payment_amount) || 0).toFixed(2)}
                    </td>
                    <td style={{ border: '2px solid black', padding: '10px' }}>
                      {new Date(schedule.due_date).toLocaleDateString()}
                    </td>
                    <td style={{ border: '2px solid black', padding: '10px' }}>
                      ₱ {(parseFloat(schedule.balance) || 0).toFixed(2)}
                    </td>
                    <td
                      style={{
                        border: '2px solid black',
                        padding: '10px',
                        color: schedule.is_paid ? 'green' : 'red',
                        fontWeight: 'bold',
                      }}
                    >
                      {schedule.is_paid ? 'Paid' : 'Pending'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ textAlign: 'center', color: '#888' }}>
              No payment schedules found for this account.
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default PaymentSchedule;
