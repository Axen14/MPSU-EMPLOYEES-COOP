import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LoanManager = () => {
    const [loans, setLoans] = useState([]);
    const [loanData, setLoanData] = useState({
        control_number: '',
        account: '',
        loan_amount: '',
        loan_type: 'Emergency',
        interest_rate: '',
        purpose: 'Education',
    });
    const [formVisible, setFormVisible] = useState(false);
    const [editingLoan, setEditingLoan] = useState(null);
    const [error, setError] = useState(null);

    const BASE_URL = 'http://localhost:8000';

    const fetchLoans = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/loans/`);
            setLoans(response.data);
        } catch (err) {
            console.error('Error fetching loans:', err.response || err);
            setError('Error fetching loans');
        }
    };

    const handleLoanSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingLoan) {
                await axios.put(`${BASE_URL}/loans/${editingLoan.control_number}/`, loanData);
            } else {
                await axios.post(`${BASE_URL}/loans/`, loanData);
            }
            fetchLoans(); 
            resetForm(); 
        } catch (err) {
            console.error('Error saving loan:', err);
            setError('Error saving loan');
        }
    };

    const handleDeleteLoan = async (controlNumber) => {
        try {
            await axios.delete(`${BASE_URL}/loans/${controlNumber}/`);
            fetchLoans();
        } catch (err) {
            console.error('Error deleting loan:', err);
        }
    };

    const handleEditLoan = (loan) => {
        setLoanData(loan);
        setFormVisible(true);
        setEditingLoan(loan);
    };

    
    const resetForm = () => {
        setLoanData({
            control_number: '',
            account: '',
            loan_amount: '',
            loan_type: 'Emergency',
            interest_rate: '',
            purpose: 'Education',
        });
        setFormVisible(false);
        setEditingLoan(null);
    };

  
    useEffect(() => {
        fetchLoans();
    }, []);

    return (
        <div>
            <h2>Loan Management</h2>
            <button onClick={() => setFormVisible(!formVisible)}>
                {formVisible ? 'Cancel' : 'Add Loan'}
            </button>

            {formVisible && (
                <form onSubmit={handleLoanSubmit}>
                    <h3>{editingLoan ? 'Edit Loan' : 'Create Loan'}</h3>
                    
                    
                    <label>Account Number:</label>
                    <input
                        type="text"
                        name="account"
                        value={loanData.account}
                        onChange={(e) => setLoanData({ ...loanData, account: e.target.value })}
                        required
                    />

                    <label>Loan Amount:</label>
                    <input
                        type="number"
                        name="loan_amount"
                        value={loanData.loan_amount}
                        onChange={(e) => setLoanData({ ...loanData, loan_amount: e.target.value })}
                        required
                    />

                    <label>Interest Rate:</label>
                    <input
                        type="number"
                        name="interest_rate"
                        value={loanData.interest_rate}
                        onChange={(e) => setLoanData({ ...loanData, interest_rate: e.target.value })}
                        required
                    />

                    <label>Loan Type:</label>
                    <select
                        name="loan_type"
                        value={loanData.loan_type}
                        onChange={(e) => setLoanData({ ...loanData, loan_type: e.target.value })}
                    >
                        <option value="Regular">Regular</option>
                        <option value="Emergency">Emergency</option>
                    </select>
                    <label>Status:</label>
                    <select
                        name="status"
                        value={loanData.status}
                        onChange={(e) => setLoanData({ ...loanData, status: e.target.value })}
                    >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Compelted">Completed</option>
                        <option value="Active">Active</option>
                    </select>

                    <label>Purpose:</label>
                    <select
                        name="purpose"
                        value={loanData.purpose}
                        onChange={(e) => setLoanData({ ...loanData, purpose: e.target.value })}
                    >
                        <option value="Education">Education</option>
                        <option value="Medical/Emergency">Medical/Emergency</option>
                        <option value="House Construction & Repair">House Construction & Repair</option>
                        <option value="Commodity/Appliances">Commodity/Appliances</option>
                        <option value="Utility Services">Utility Services</option>
                        <option value="Others">Others</option>
                    </select>

                    <button type="submit">{editingLoan ? 'Update Loan' : 'Create Loan'}</button>
                    <button type="button" onClick={resetForm}>Clear</button>
                </form>
            )}
        
            {error && <div style={{ color: 'red' }}>{error}</div>}

            
            <h2>Loan List</h2>
            {loans.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Control No.</th>
                            <th>Account No.</th>
                            <th>Amount</th>
                            <th>Type</th>
                            <th>Interest</th>
                            <th>Status</th>
                            <th>Purpose</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loans.map((loan) => (
                            <tr key={loan.control_number}>
                                <td>{loan.control_number}</td>
                                <td>{loan.account}</td>
                                <td>{loan.loan_amount}</td>
                                <td>{loan.loan_type}</td>
                                <td>{loan.interest_rate}%</td>
                                <td>{loan.status}</td>
                                <td>{loan.purpose}</td>
                                <td>
                                    <button onClick={() => handleEditLoan(loan)}>Edit</button>
                                    <button onClick={() => handleDeleteLoan(loan.control_number)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No loans available.</p>
            )}
        </div>
    );
};

export default LoanManager;
