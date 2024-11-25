import React, { useState, useEffect } from 'react';

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
        <form onSubmit={handleSubmit}>
            <h3>{existingLoan ? 'Edit Loan' : 'Add New Loan'}</h3>
            <div>
                <label>Account Number:</label>
                <input
                    type="text"
                    value={accountNumber}
                    onChange={e => setAccountNumber(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Loan Amount:</label>
                <input
                    type="number"
                    value={loanAmount}
                    onChange={e => setLoanAmount(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Loan Type:</label>
                <select value={loanType} onChange={e => setLoanType(e.target.value)}>
                    <option value="Regular">Regular</option>
                    <option value="Emergency">Emergency</option>
                </select>
            </div>
            <div>
                <label>Loan Period (Months):</label>
                <input
                    type="number"
                    value={loanPeriod}
                    onChange={e => setLoanPeriod(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Interest Rate:</label>
                <input
                    type="number"
                    value={interestRate}
                    onChange={e => setInterestRate(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Service Fee:</label>
                <input
                    type="number"
                    value={serviceFee}
                    onChange={e => setServiceFee(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Penalty Rate:</label>
                <input
                    type="number"
                    value={penaltyRate}
                    onChange={e => setPenaltyRate(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Status:</label>
                <select value={status} onChange={e => setStatus(e.target.value)}>
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Completed">Completed</option>
                </select>
            </div>
            <div>
                <label>Purpose:</label>
                <select value={purpose} onChange={e => setPurpose(e.target.value)}>
                    <option value="Education">Education</option>
                    <option value="Medical">Medical/Emergency</option>
                    <option value="House">House Construction & Repair</option>
                    <option value="Appliances">Commodity/Appliances</option>
                    <option value="Utility">Utility Services</option>
                    <option value="Others">Others</option>
                </select>
            </div>
            <button type="submit">{existingLoan ? 'Update Loan' : 'Submit Loan'}</button>
        </form>
    );
};

export default AddLoanForm;
