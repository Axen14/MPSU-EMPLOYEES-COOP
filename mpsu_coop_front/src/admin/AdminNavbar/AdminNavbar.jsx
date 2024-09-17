
import React from 'react';
import NavItem from '../NavItem/NavItem';
import styles from './AdminNavbar.module.css';

const navItems = [
  { icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/4be9f2efe05dd3fcefb63ba9437698d92f285923297cfc1a41d8ade4c427f127?placeholderIfAbsent=true&apiKey=a955dfffdd554c5782f70fb62e387644', label: 'Deposit' },
  { icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/4a6671c938ee384204c2624efd96542eae0ddafe4cc8098c95457f8d35c3b79a?placeholderIfAbsent=true&apiKey=a955dfffdd554c5782f70fb62e387644', label: 'Deposit' },
  { icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/6b7746246e473ace6e10e561470de72448e8087c0141713a93834c9dc52e7394?placeholderIfAbsent=true&apiKey=a955dfffdd554c5782f70fb62e387644', label: 'Withdraw' },
  { icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/a5e8043d2626ff06a89fcf8d88c2b18c2a3c1a48e9a3544bffba0bf2d28f34bb?placeholderIfAbsent=true&apiKey=a955dfffdd554c5782f70fb62e387644', label: 'Payment' },
  { icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/0e1f313ea14128f09dc8ea3b2a83bf46ca736c27b92a5ddff8bde2d47f5d08a6?placeholderIfAbsent=true&apiKey=a955dfffdd554c5782f70fb62e387644', label: 'Loans' },
  { icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/5325a8142151b76402b6371c71ed0557e89c12e1bcf859dd196c53ac55cd4186?placeholderIfAbsent=true&apiKey=a955dfffdd554c5782f70fb62e387644', label: 'Account' },
  { icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/90880b994a7e88b9603c86fd253078a5f9ba8e0eb95285c0725a24349ab09813?placeholderIfAbsent=true&apiKey=a955dfffdd554c5782f70fb62e387644', label: 'User Management', multiline: true },
];

function AdminNavbar() {
  return (
    <nav className={styles.adminNavbar}>
      <h1 className={styles.logoSystemName}>MPSPC CREDIT COOP</h1>
      <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/8bfe72ac8ed57efa94b007072229948a503e6833de11b42732a87835f2ef5650?placeholderIfAbsent=true&apiKey=a955dfffdd554c5782f70fb62e387644" alt="" className={styles.logoImage} />
      {navItems.map((item, index) => (
        <NavItem key={index} {...item} />
      ))}
      <div className={styles.logOut}>
        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/73071d1db9ea7d574bc10ef0ff2955c13d8e70d4d5c94d1c532e5b1f003160a7?placeholderIfAbsent=true&apiKey=a955dfffdd554c5782f70fb62e387644" alt="" className={styles.logOutIcon} />
        <span className={styles.logOutText}>Log out</span>
      </div>
    </nav>
  );
}

export default AdminNavbar;
