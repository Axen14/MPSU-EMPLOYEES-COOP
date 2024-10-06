import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Loans.css';

const Loans = () => {
    const [loans, setLoans] = useState([]);
    const [formData, setFormData] = useState({
        control_number: '',
        account: '',
        loan_amount: '',
        loan_type: 'Regular',
        loan_period: '',
        loan_period_unit: 'Months',
        interest_rate: 5,
        purpose: 'Choose Purpose',
        others_purpose: '',
        nameOfSpouse: 'If applicable',
    });
    const [editingLoan, setEditingLoan] = useState(null);

    const fetchLoans = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/loans/');
            setLoans(response.data);
        } catch (error) {
            console.error('Error fetching loans:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const resetForm = () => {
        setFormData({
            control_number: '',
            account: '',
            loan_amount: '',
            loan_type: 'Regular',
            loan_period: '',
            loan_period_unit: 'Months',
            interest_rate: 5,
            purpose: 'Choose Purpose',
            others_purpose: '',
            nameOfSpouse: 'If applicable',
        });
        setEditingLoan(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingLoan) {
                await axios.put(`http://localhost:8000/api/loans/${editingLoan}/`, formData);
            } else {
                await axios.post('http://localhost:8000/api/loans/', formData);
            }
            fetchLoans(); 
            resetForm();
        } catch (error) {
            console.error('Error saving loan:', error);
        }
    };

    const handleEdit = (loan) => {
        setEditingLoan(loan.control_number);
        setFormData(loan);
    };

    const handleDelete = async (control_number) => {
        try {
            await axios.delete(`http://localhost:8000/api/loans/${control_number}/`);
            fetchLoans(); 
        } catch (error) {
            console.error('Error deleting loan:', error);
        }
    };

    useEffect(() => {
        fetchLoans();
    }, []);

    return (
        <div className="loan-management-container">
            <h1>Loan Management</h1>
            <div className="loan-section">
                <h2>Personal Details</h2>
                <div className="form-group">
                    <label>Control Number</label>
                    <input
                        type="text"
                        name="control_number"
                        value={formData.control_number}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Account</label>
                    <input
                        type="text"
                        name="account"
                        value={formData.account}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Loan Amount</label>
                    <input
                        type="number"
                        name="loan_amount"
                        value={formData.loan_amount}
                        onChange={handleChange}
                        min="1"
                        required
                    />
                </div>
                {/* Loan Type Section */}
                <div className="form-group">
                    <label>Loan Type</label>
                    <select name="loan_type" value={formData.loan_type} onChange={handleChange}>
                        <option value="Regular">Regular</option>
                        <option value="Emergency">Emergency</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Loan Period</label>
                    <input
                        type="number"
                        name="loan_period"
                        value={formData.loan_period}
                        onChange={handleChange}
                        min="1"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Loan Period Unit</label>
                    <select
                        name="loan_period_unit"
                        value={formData.loan_period_unit}
                        onChange={handleChange}
                    >
                        <option value="Months">Months</option>
                        <option value="Years">Years</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Interest Rate</label>
                    <input
                        type="number"
                        name="interest_rate"
                        value={formData.interest_rate}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        required
                    />
                </div>
            </div>

            {/* Purpose Section */}
            <div className="loan-section">
                <div className="form-group">
                    <label>Purpose</label>
                    <select name="purpose" value={formData.purpose} onChange={handleChange}>
                        <option value="Choose Purpose">Choose Purpose</option>
                        <option value="Home">Home</option>
                        <option value="Car">Business</option>
                        <option value="Others">Others</option>
                    </select>
                </div>
                {formData.purpose === "Others" && (
                    <div className="form-group">
                        <label>Specify Purpose</label>
                        <input
                            type="text"
                            name="others_purpose"
                            value={formData.others_purpose}
                            onChange={handleChange}
                        />
                    </div>
                )}
            </div>

            {/* Submit Section */}
            <button type="submit" disabled={!formData.loan_amount || !formData.account}>
                {editingLoan ? 'Update Loan' : 'Add Loan'}
            </button>

            <ul>
                {loans.map((loan) => (
                    <li key={loan.control_number}>
                        {loan.control_number} - {loan.loan_amount} - {loan.status}
                        <button onClick={() => handleEdit(loan)}>Edit</button>
                        <button onClick={() => handleDelete(loan.control_number)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Loans;
