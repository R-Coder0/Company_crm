import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import LockLogo from '../assets/signlogo.png'; // Update this path

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      if (response.data && response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
        navigate('/dashboard'); // Make sure this path is correct
      } else {
        setError('Login failed. Please try again.');
      }
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
            <img src={LockLogo} alt="Lock Logo" />
          </div>
          <h2 className="login-title">Admin Login Page</h2>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="remember-me">
              <label>
                <input type="checkbox" /> Remember me
              </label>
            </div>
            <button type="submit" className="login-btn">Sign In</button>
          </form>
          {error && <p className="login-error">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
 