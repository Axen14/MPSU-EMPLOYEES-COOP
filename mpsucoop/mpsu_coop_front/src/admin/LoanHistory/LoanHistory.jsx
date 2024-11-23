import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {AiOutlineUsergroupAdd} from "react-icons/ai";
import { FaEdit } from 'react-icons/fa';
import { FaTrash } from "react-icons/fa6";

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
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2 style={{ textAlign: 'left', marginBottom: '15px' }}>Loan Management</h2>
            <button
                onClick={() => setFormVisible(!formVisible)}
                style={{
                    padding: '10px 20px',
                    backgroundColor: '#4CAF50',
                    color: 'black',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginBottom: '15px',
                    marginLeft: '87%',
                }}
            >
                {formVisible ? 'Cancel' : <><AiOutlineUsergroupAdd /> Add Loan</>}
            </button>

            {formVisible && (
                <form
                    onSubmit={handleLoanSubmit}
                    style={{
                        padding: '15px',
                        border: '1px solid black',
                        borderRadius: '5px',
                        marginBottom: '30px',
                        backgroundColor: 'white',
                    }}
                >
                    <h3 style={{ textAlign: 'center' }}>{editingLoan ? 'Edit Loan' : 'Create Loan'}</h3>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Account Number:</label>
                        <input
                            type="text"
                            name="account"
                            value={loanData.account}
                            onChange={(e) => setLoanData({ ...loanData, account: e.target.value })}
                            required
                            style={{ padding: '5px', marginLeft: '5px' }}
                        />
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                        <label>Loan Amount:</label>
                        <input
                            type="number"
                            name="loan_amount"
                            value={loanData.loan_amount}
                            onChange={(e) => setLoanData({ ...loanData, loan_amount: e.target.value })}
                            required
                            style={{ padding: '5px', marginLeft: '5px' }}
                        />
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                        <label>Interest Rate:</label>
                        <input
                            type="number"
                            name="interest_rate"
                            value={loanData.interest_rate}
                            onChange={(e) => setLoanData({ ...loanData, interest_rate: e.target.value })}
                            required
                            style={{ padding: '5px', marginLeft: '5px' }}
                        />
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                        <label>Loan Type:</label>
                        <select
                            name="loan_type"
                            value={loanData.loan_type}
                            onChange={(e) => setLoanData({ ...loanData, loan_type: e.target.value })}
                            style={{ padding: '5px', marginLeft: '5px' }}
                        >
                            <option value="Regular">Regular</option>
                            <option value="Emergency">Emergency</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                        <label>Status:</label>
                        <select
                            name="status"
                            value={loanData.status}
                            onChange={(e) => setLoanData({ ...loanData, status: e.target.value })}
                            style={{ padding: '5px', marginLeft: '5px' }}
                        >
                            <option value="Pending"></option>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Completed">Completed</option>
                            <option value="Active">Active</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                        <label>Purpose:</label>
                        <select
                            name="purpose"
                            value={loanData.purpose}
                            onChange={(e) => setLoanData({ ...loanData, purpose: e.target.value })}
                            style={{ padding: '5px', marginLeft: '5px' }}
                        >
                            <option value="Education">Education</option>
                            <option value="Medical/Emergency">Medical/Emergency</option>
                            <option value="House Construction & Repair">House Construction & Repair</option>
                            <option value="Commodity/Appliances">Commodity/Appliances</option>
                            <option value="Utility Services">Utility Services</option>
                            <option value="Others">Others</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#4CAF0',
                            color: 'black',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            marginRight: '10px',
                        }}
                    >
                        {editingLoan ? 'Update Loan' : 'Create Loan'}
                    </button>
                    <button
                        type="button"
                        onClick={resetForm}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: 'red',
                            color: 'black',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                    >
                        Clear
                    </button>
                </form>
            )}

            {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}

            <h2 style={{ textAlign: 'left', marginBottom: '20px' }}>Loan List</h2>
            {loans.length > 0 ? (
                <table
                    style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        marginBottom: '20px',
                    }}
                >
                    <thead>
                        <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
                            <th style={{ padding: '10px', border: '2px solid black' }}>Control No.</th>
                            <th style={{ padding: '10px', border: '2px solid black' }}>Account No.</th>
                            <th style={{ padding: '10px', border: '2px solid black' }}>Amount</th>
                            <th style={{ padding: '10px', border: '2px solid black' }}>Type</th>
                            <th style={{ padding: '10px', border: '2px solid black' }}>Interest</th>
                            <th style={{ padding: '10px', border: '2px solid black' }}>Status</th>
                            <th style={{ padding: '10px', border: '2px solid black' }}>Purpose</th>
                            <th style={{ padding: '10px', border: '2px solid black' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loans.map((loan) => (
                            <tr key={loan.control_number}>
                                <td style={{ padding: '10px', border: '2px solid black' }}>{loan.control_number}</td>
                                <td style={{ padding: '10px', border: '2px solid black' }}>{loan.account}</td>
                                <td style={{ padding: '10px', border: '2px solid black' }}>{loan.loan_amount}</td>
                                <td style={{ padding: '10px', border: '2px solid black' }}>{loan.loan_type}</td>
                                <td style={{ padding: '10px', border: '2px solid black' }}>{loan.interest_rate}%</td>
                                <td style={{ padding: '10px', border: '2px solid black' }}>{loan.status}</td>
                                <td style={{ padding: '10px', border: '2px solid black' }}>{loan.purpose}</td>
                                <td style={{ padding: '10px', border: '2px solid black' }}>
                                    <button
                                        onClick={() => handleEditLoan(loan)}
                                        style={{
                                            padding: '5px 10px',
                                            backgroundColor: '#4CAF50',
                                            color: 'black',
                                            border: 'none',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                            marginRight: '5px',
                                        }}
                                    >
                                        <FaEdit />Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteLoan(loan.control_number)}
                                        style={{
                                            padding: '5px 10px',
                                            backgroundColor: 'red',
                                            color: 'black',
                                            border: 'none',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <FaTrash />Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p style={{ textAlign: 'center', color: 'gray' }}>No loans available.</p>
            )}
        </div>
    );
};

export default LoanManager;
