  import React from 'react';
  import Navbar from './Navbar';
  import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import '../Style.css'; // Styling for the layout

const DashboardLayout = () => {
  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-content">
        <Sidebar />
        <div className="main-content">
          <Outlet />  {/* Child routes will render here */}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
