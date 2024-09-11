import { useNavigate } from 'react-router-dom';
import './LoginSelectionPage.css'; // Assume some basic CSS for styling

const LoginSelection = () => {
  const navigate = useNavigate();

  const handleAdminLogin = () => {
    // Navigate to Admin Login page
    navigate('/login');
  };

  const handleEmployeeLogin = () => {
    // Navigate to Employee Login page
    navigate('/employee-login');
  };

  return (
    <div className="login-selection-container">
      <h1>Welcome to Our CRM</h1>
      <div className="login-options">
        <button onClick={handleAdminLogin} className="login-btn">Admin Login</button>
        <button onClick={handleEmployeeLogin} className="login-btn">Employee Login</button>
      </div>
    </div>
  );
};

export default LoginSelection;
