import React from 'react';
import "./Sidebar.css"; 


const handleMenuClick = (event) => {
    const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');
    allSideMenu.forEach((item) => item.parentElement.classList.remove('active'));   
  
    event.target.parentElement.classList.add('active');
  };
  
  const Sidebar = () => {
    const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');
  
    React.useEffect(() => {
      allSideMenu.forEach((item) => item.addEventListener('click', handleMenuClick));
  
      return () => {
        allSideMenu.forEach((item) => item.removeEventListener('click', handleMenuClick));
      };
    }, []);
  
    const toggleSidebar = () => {
      const sidebar = document.getElementById('sidebar');
      sidebar.classList.toggle('hide');
    };

  return (
    <section id="sidebar">
      <a href="#" className="brand">
        <i className='bx bxs-smile'></i>
        <span className="text">MPSU</span>
      </a>
      <ul className="side-menu top">
        <li className="active">
          <a href="/Home" onClick={handleMenuClick}>
            <i className='bx bxs-home' ></i>
            <span className="text">Home</span>
          </a>
        </li>
       
        <li>
          <a href="/Loans" onClick={handleMenuClick}>
            <i className='bx bxs-shopping-bag-alt' ></i>
            <span className="text">Loans</span>
          </a>
        </li>
        
      </ul>
    <ul className="side-menu">   
        <li>
          <a href="#" className="logout" onClick={handleMenuClick}>
            <i className='bx bxs-log-out-circle' ></i>
            <span className="text">Logout</span>
          </a>
        </li>
      </ul>
      <nav>
        <i className="bx bx-menu" onClick={toggleSidebar} />
      </nav>
    </section>
  );
};

export default Sidebar;