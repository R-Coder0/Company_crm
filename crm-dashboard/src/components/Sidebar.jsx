import { Link } from 'react-router-dom';
import '../Style.css';

const Sidebar = () => {
  return (
<div className="sidebar-AP">
  <ul>
    <li>
      <Link to="/dashboard">Dashboard</Link>
    </li>
    <li>
      <Link to="/dashboard/clients">Clients</Link> {/* Ensure these routes match exactly */}
    </li>
    <li>
      <Link to="/dashboard/employees">Employees</Link>
    </li>
    <li>
      <Link to="/dashboard/assign-clients">Assign Clients</Link>
    </li>
  </ul>
</div>
  );
};

export default Sidebar;
