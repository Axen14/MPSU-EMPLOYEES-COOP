
import React from 'react';
import AdminNavbar from '../AdminNavbar/AdminNavbar';
import DashboardHeader from '../DashboardHeader/DashboardHeader';
import LoanSummary from '../LoanSummary/LoanSummary';
import MembersTable from '../MembersTable/MembersTable';
import styles from './AdminDashboard.module.css';


function AdminDashboard() {
  return (
    <div className={styles.adminDashboardContainer}>
      <AdminNavbar />
      <main className={styles.adminDashboardMain}>
        <DashboardHeader />
        <LoanSummary />
        <MembersTable />
      </main>
    </div>
  );
}



export default AdminDashboard;