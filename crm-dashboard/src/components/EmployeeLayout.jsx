import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import './EmployeeLayout.css'; // Ensure correct styling is applied

const EmployeeLayout = () => {
  const location = useLocation();

  const isActiveLink = (path) => location.pathname === path;

  return (
    <div className="employee-layout">
      <aside className="sidebar-ed">
        <h3>Dashboard</h3>
        <nav>
          <ul>
            <li className={isActiveLink('/employee-dashboard') ? 'active' : ''}>
              <Link to="/employee-dashboard"><i className="fas fa-home"></i> Home</Link>
            </li>
            <li className={isActiveLink('/employee-dashboard/tasks') ? 'active' : ''}>
              <Link to="/employee-dashboard/tasks"><i className="fas fa-tasks"></i> Tasks</Link>
            </li>
            <li className={isActiveLink('/employee-dashboard/profile') ? 'active' : ''}>
              <Link to="/employee-dashboard/profile"><i className="fas fa-user"></i> Profile</Link>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="main-content-ED">
        <Outlet /> {/* Render child routes here */}
      </main>
    </div>
  );
};

export default EmployeeLayout;
