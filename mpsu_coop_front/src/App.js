import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Topbar from './member/Topbar/Topbar';
import Home from './member/Home/Home';
import Account from './member/Account/Account';
import Loans from './member/Loans/Loans';
import Payments from './member/Payments/Payments';



function App() {
  return (
    <Router>
      <div className='App'>
        <Topbar/>
        <Routes>
        <Route path="/Home" element={<Home />} />
          <Route path="/Account" element={<Account />} />
          <Route path="/Loans" element={<Loans />} />
          <Route path="/Payments" element={<Payments />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
