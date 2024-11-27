import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddPaymentForm from './AddPaymentForm';
import './Payments.css';
import {AiOutlineUsergroupAdd} from "react-icons/ai";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddPaymentForm, setShowAddPaymentForm] = useState(false);

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

  return (
    <div className="payments-container">
      <h2>Payment Records</h2>

      {!showAddPaymentForm && (
        <>
          {loading && <p>Loading payments...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}

          <button onClick={() => setShowAddPaymentForm(true)}><AiOutlineUsergroupAdd />Add Payment</button>

          {payments.length > 0 ? (
            <table className="payments-table">
              <thead>
                <tr>
                  <th>Payment ID</th>
                  {/* <th>Loan Number</th> */}
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
                    {/* <td>{payment.OR}</td> */}
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
        <AddPaymentForm
          onClose={() => setShowAddPaymentForm(false)}
          fetchPayments={fetchPayments}
        />
      )}
    </div>
  );
};

export default Payments;
