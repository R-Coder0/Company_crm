import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // Reuse the same CSS for both admin and employee login pages
import signin from '../assets/signlogo.png'


const EmployeeLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/auth/employee-login', formData);

      if (response.data && response.data.token) {
        // Store the employee token in localStorage
        localStorage.setItem('employeeToken', response.data.token);

        // Redirect to the employee dashboard
        navigate('/employee-dashboard');
      } else {
        setError('Login failed. Please try again.');
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
      </div>
      <div className="login-right">
        <div className="login-form-container">
          <div className="login-logo">
            <img src={signin} alt="User Icon" />
          </div>
          <h2>Employee Login</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button type="submit" className="login-btn">Sign In</button>
          </form>
          {error && <p className="login-error">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default EmployeeLogin;
