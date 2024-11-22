import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminDashboard from './admin/AdminDashboard/AdminDashboard';
// import Home from './member/Home/Home';
// import Login from './login/Login';

function App() {
  return (
    <AdminDashboard/>

    // <Router>
    //   <Routes>
    //     <Route path="/" element={<Login />} />
    //     <Route path="/admin-dashboard" element={<AdminDashboard />} />
    //     <Route path="/home" element={<Home />} />
    //     {/* Add a fallback route for any undefined paths */}
    //     {/* <Route path="*" element={<Navigate to="/" />} /> */}
    //   </Routes>
    // </Router>
    
  );
}
 
export default App;