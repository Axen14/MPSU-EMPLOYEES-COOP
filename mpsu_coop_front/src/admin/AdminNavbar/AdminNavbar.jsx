
import React from 'react';
// import NavItem from '../NavItem/NavItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faDollarSign, faFileInvoiceDollar, faLandmark, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import styles from './AdminNavbar.module.css';

const navItems = [
  // { icon: faHome, label: 'Home' },
  { icon: faLandmark, label: 'Accounts' },
  { icon: faFileInvoiceDollar, label: 'Loans' },
  { icon: faDollarSign, label: 'Payments' },
  { icon: faUser, label: 'User Management' },
];

function AdminNavbar({ onLinkClick }) {
  return (
    <nav className={styles.adminNavbar}>
      <h1 className={styles.logoSystemName}>MPSPC CREDIT COOP</h1>
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/8bfe72ac8ed57efa94b007072229948a503e6833de11b42732a87835f2ef5650?placeholderIfAbsent=true&apiKey=a955dfffdd554c5782f70fb62e387644"
        alt="Logo"
        className={styles.logoImage}
      />
      <ul className={styles.navList}>
        {navItems.map((item, index) => (
          <li key={index} className={styles.navItem} onClick={() => onLinkClick(item.label.toLowerCase())}>
            <FontAwesomeIcon icon={item.icon} className={styles.navIcon} />
            <span className={styles.navLabel}>{item.label}</span>
          </li>
        ))}
      </ul>
      <div className={styles.logOut} onClick={() => console.log('Log out')}>
        <FontAwesomeIcon icon={faSignOutAlt} className={styles.logOutIcon} />
        <span className={styles.logOutText}>Log out</span>
      </div>
    </nav>
  );
}

export default AdminNavbar;
