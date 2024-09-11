import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import './EmployeeDashboard.css';

const EmployeeDashboard = () => {
  const [employee, setEmployee] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const token = localStorage.getItem('employeeToken'); // Fetch employee token
        if (!token) {
          navigate('/employee-login');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/employees/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setEmployee(response.data);
      } catch (error) {
        console.error('Error fetching employee details:', error);
        navigate('/employee-login');
      }
    };

    fetchEmployeeDetails();
  }, [navigate]);

  if (!employee) return <p>Loading...</p>;

  // Function to determine if the link is active
  const isActiveLink = (path) => location.pathname === path;

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('employeeToken'); // Remove employee token from local storage
    navigate('/employee-login'); // Redirect to the login page
  };

  return (
    <div className="employee-dashboard">
      <main className="main-content-ed">
        <header className="header">
          <h1>Welcome, {employee.name}</h1>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </header>

        <section className="employee-details">
          <div className="info-card">
            <p><strong>Email:</strong> {employee.email}</p>
            <p><strong>Position:</strong> {employee.position}</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default EmployeeDashboard;
