import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, role }) => {
  let token = null;

  if (role === 'admin') {
    token = localStorage.getItem('adminToken');
  } else if (role === 'employee') {
    token = localStorage.getItem('employeeToken');
  }

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
};


export default PrivateRoute;
