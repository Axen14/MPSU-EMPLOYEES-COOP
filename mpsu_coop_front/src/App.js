import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Topbar from './member/Topbar/Topbar';
import Home from './member/Home/Home';
import Account from './member/Account/Account';
import Loans from './member/Loans/Loans';
import Payments from './member/Payments/Payments';
import Ledger from './member/Ledger/Ledger';

const Logout = () => {
  return (
    <div>
      <h1>Logout</h1>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className='App'>
        <Topbar />
        <Routes>
          <Route path="/Home" element={<Home />} />
          <Route path="/Ledger" element={<Ledger />} /> 
          <Route path="/Account" element={<Account />} />
          <Route path="/Loans" element={<Loans />} />
          <Route path="/Payments" element={<Payments />} />
          <Route path="/" element={<Logout />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
