
import { Link, useNavigate } from 'react-router-dom';
import NotificationBell from './NotificationBell';
import '../Style.css'

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">CRM Admin Dashboard</div>
      <div className="navbar-links">
        <Link to="/dashboard">Home</Link>
        <Link to="/clients">Clients</Link>
        <Link to="/employees">Employees</Link> {/* Ensure this link matches your route */}
        <NotificationBell />
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
