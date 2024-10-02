import React, { useEffect, useState } from 'react';
import axios from 'axios';

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingLoan) {
                
                await axios.put(`http://localhost:8000/api/loans/${editingLoan}/`, formData);
            } else {
                
                await axios.post('http://localhost:8000/api/loans/', formData);
            }
            fetchLoans(); t
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
        <div>
            <h1>Loan Management</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="control_number"
                    value={formData.control_number}
                    onChange={handleChange}
                    placeholder="Control Number"
                    required
                />
                <input
                    type="text"
                    name="account"
                    value={formData.account}
                    onChange={handleChange}
                    placeholder="Account"
                    required
                />
                <input
                    type="number"
                    name="loan_amount"
                    value={formData.loan_amount}
                    onChange={handleChange}
                    placeholder="Loan Amount"
                    required
                />
                <select name="loan_type" value={formData.loan_type} onChange={handleChange}>
                    <option value="Regular">Regular</option>
                    <option value="Emergency">Emergency</option>
                </select>
                <input
                    type="number"
                    name="loan_period"
                    value={formData.loan_period}
                    onChange={handleChange}
                    placeholder="Loan Period"
                    required
                />
                <select name="loan_period_unit" value={formData.loan_period_unit} onChange={handleChange}>
                    <option value="Months">Months</option>
                    <option value="Years">Years</option>
                </select>
                <input
                    type="number"
                    name="interest_rate"
                    value={formData.interest_rate}
                    onChange={handleChange}
                    placeholder="Interest Rate"
                    required
                />
                <button type="submit">{editingLoan ? 'Update Loan' : 'Add Loan'}</button>
            </form>

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
