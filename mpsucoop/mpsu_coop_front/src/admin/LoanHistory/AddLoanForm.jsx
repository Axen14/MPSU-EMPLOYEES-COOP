import React, { useState, useEffect } from 'react';
import './AddLoanForm.css';

const AddLoanForm = ({ onSubmit, existingLoan }) => {
    const [loanAmount, setLoanAmount] = useState('');
    const [loanPeriod, setLoanPeriod] = useState('');
    const [loanType, setLoanType] = useState('Regular');
    const [interestRate, setInterestRate] = useState('');
    const [serviceFee, setServiceFee] = useState('');
    const [penaltyRate, setPenaltyRate] = useState('');
    const [status, setStatus] = useState('Approved');
    const [purpose, setPurpose] = useState('Education');
    const [accountNumber, setAccountNumber] = useState(''); 

    const handleSubmit = (e) => {
        e.preventDefault();
        const loanData = {
            account_number: accountNumber, 
            loan_amount: parseFloat(loanAmount) || 0,
            loan_period: parseInt(loanPeriod) || 0,
            loan_type: loanType,
            interest_rate: parseFloat(interestRate) || 0,
            service_fee: parseFloat(serviceFee) || 0,
            penalty_rate: parseFloat(penaltyRate) || 0,
            status: status,
            purpose: purpose
        };
        console.log("Submitting loan data: ", loanData); 
        onSubmit(loanData);
        resetForm();
    };

    useEffect(() => {
        if (existingLoan) {
            setLoanAmount(existingLoan.loan_amount);
            setLoanPeriod(existingLoan.loan_period);
            setLoanType(existingLoan.loan_type);
            setAccountNumber(existingLoan.account_number); 
            setStatus(existingLoan.status);
            setPurpose(existingLoan.purpose); 
        } else {
            resetForm();
        }
    }, [existingLoan]);

    const resetForm = () => {
        setLoanAmount('');
        setLoanPeriod('');
        setLoanType('Regular');
        setAccountNumber('');
        setInterestRate('');
        setServiceFee('');
        setPenaltyRate('');
        setStatus('Approved');
        setPurpose('Education');
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial, sans-serif', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
            <h3 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>{existingLoan ? 'Edit Loan' : 'Add New Loan'}</h3>
            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Account Number:</label>
                <input
                    type="text"
                    value={accountNumber}
                    onChange={e => setAccountNumber(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
            </div>
            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Loan Amount:</label>
                <input
                    type="number"
                    value={loanAmount}
                    onChange={e => setLoanAmount(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
            </div>
            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Loan Type:</label>
                <select
                    value={loanType}
                    onChange={e => setLoanType(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                    <option value="Regular">Regular</option>
                    <option value="Emergency">Emergency</option>
                </select>
            </div>
            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Loan Period (Months):</label>
                <input
                    type="number"
                    value={loanPeriod}
                    onChange={e => setLoanPeriod(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
            </div>
            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Interest Rate:</label>
                <input
                    type="number"
                    value={interestRate}
                    onChange={e => setInterestRate(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
            </div>
            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Service Fee:</label>
                <input
                    type="number"
                    value={serviceFee}
                    onChange={e => setServiceFee(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
            </div>
            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Penalty Rate:</label>
                <input
                    type="number"
                    value={penaltyRate}
                    onChange={e => setPenaltyRate(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
            </div>
            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Status:</label>
                <select
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Completed">Completed</option>
                </select>
            </div>
            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Purpose:</label>
                <select
                    value={purpose}
                    onChange={e => setPurpose(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                    <option value="Education">Education</option>
                    <option value="Medical">Medical/Emergency</option>
                    <option value="House">House Construction & Repair</option>
                    <option value="Appliances">Commodity/Appliances</option>
                    <option value="Utility">Utility Services</option>
                    <option value="Others">Others</option>
                </select>
            </div>
            <button
                type="submit"
                style={{ width: '100%', padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
                {existingLoan ? 'Update Loan' : 'Submit Loan'}
            </button>
        </form>
    );
};

export default AddLoanForm;
