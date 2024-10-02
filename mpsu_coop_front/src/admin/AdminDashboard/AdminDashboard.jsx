import React, { useState } from 'react';
import AdminNavbar from '../AdminNavbar/AdminNavbar';
import DashboardHeader from '../DashboardHeader/DashboardHeader';
import LoanSummary from '../LoanSummary/LoanSummary';
import Members from '../Members/Members';
import Accounts from '../Accounts/Accounts';
import Loans from '../Loans/Loans';
import styles from './AdminDashboard.module.css';

function AdminDashboard() {
  const [activeComponent, setActiveComponent] = useState('');

  // Function to render the appropriate component based on the current state
  const renderComponent = () => {
    switch (activeComponent) {
      case 'members':
        return <Members />;
      case 'loanSummary':
        return <LoanSummary />;
      case 'accounts': 
        return <Accounts />;
      case 'loans': 
        return <Loans />;
      default:
        return (
          <div>
            <Members />
            <LoanSummary />
          </div>
        );
    }
  };

  return (
    <div className={styles.adminDashboardContainer}>
      <AdminNavbar onLinkClick={setActiveComponent} />
      
      <main className={styles.adminDashboardMain}>
        
        <DashboardHeader />
        
        
        {renderComponent()}
      </main>
    </div>
  );
}

export default AdminDashboard;
