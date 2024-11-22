import React from 'react';
import { Link } from 'react-router-dom';
import './Topbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faUser, faMoneyBill, faCreditCard, faPowerOff } from '@fortawesome/free-solid-svg-icons';

const Topbar = () => {
  return (
    <div className="Topbar">
      <div className="nav-header">MPSPC CREDIT COOP</div>
      <ul className="nav-Topbar">
      <li className="nav-item">
          <Link to="/Home" className="nav-link">
            <FontAwesomeIcon icon={faTachometerAlt} className="nav-icon" />
            <p>Dashboard</p>
            </Link>
        </li>
        <li className="nav-item">
          <Link to="/Account" className="nav-link">
            <FontAwesomeIcon icon={faUser} className="nav-icon" />
            <p>Account</p>
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/Loans" className="nav-link">
            <FontAwesomeIcon icon={faMoneyBill} className="nav-icon" />
            <p>Loan</p>
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/Payments" className="nav-link">
            <FontAwesomeIcon icon={faCreditCard} className="nav-icon" />
            <p>Payment</p>
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/src/login" className="nav-link">
            <FontAwesomeIcon icon={faPowerOff} className="nav-icon" />
            <p>Logout</p>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Topbar;