import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import EmployeeLayout from './components/EmployeeLayout';
import Clients from './pages/Clients';
import Employees from './pages/Employees';
import Login from './pages/Login';
import EmployeeLogin from './pages/EmployeeLogin';
import EmployeeDashboard from './pages/EmployeeDashboard';
import EmployeeTasks from './pages/EmployeeTask'; // Import EmployeeTasks
import PrivateRoute from './components/PrivateRoute';
import ClientAssignment from './pages/ClientAssignment';
import LoginSelectionPage from './pages/LoginSelectionPage'; // Ensure this import is correct

const App = () => {
  const isAdminAuthenticated = !!localStorage.getItem('adminToken');
  const isEmployeeAuthenticated = !!localStorage.getItem('employeeToken');

  return (
    <Router>
      <Routes>
        {/* Default route to handle login redirection */}
        <Route
          path="/"
          element={
            isAdminAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : isEmployeeAuthenticated ? (
              <Navigate to="/employee-dashboard" replace />
            ) : (
              <LoginSelectionPage />
            )
          }
        />

        {/* Admin Login */}
        <Route path="/login" element={<Login />} />

        {/* Employee Login */}
        <Route path="/employee-login" element={<EmployeeLogin />} />

        {/* Admin Dashboard Routes */}
        <Route path="/dashboard" element={<PrivateRoute role="admin"><DashboardLayout /></PrivateRoute>}>
          <Route index element={<div>Admin Dashboard Home</div>} />
          <Route path="clients" element={<Clients />} />
          <Route path="employees" element={<Employees />} />
          <Route path="assign-clients" element={<ClientAssignment />} />
        </Route>

        {/* Employee Dashboard Routes */}
        <Route path="/employee-dashboard" element={<PrivateRoute role="employee"><EmployeeLayout /></PrivateRoute>}>
          <Route index element={<EmployeeDashboard />} />
          <Route path="tasks" element={<EmployeeTasks />} />
        </Route>

        {/* Catch-all Route for Undefined Paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
