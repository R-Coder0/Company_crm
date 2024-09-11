import { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Bind modal to your app root

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // New state to track editing mode
  const [editingEmployeeId, setEditingEmployeeId] = useState(null); // Store the ID of the employee being edited
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    position: '',
    image: null,
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/employees', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const openModal = (employee = null) => {
    if (employee) {
      // If an employee is provided, we're in editing mode
      setIsEditing(true);
      setEditingEmployeeId(employee._id);
      setFormData({
        name: employee.name,
        email: employee.email,
        password: '',
        phone: employee.phone,
        address: employee.address,
        position: employee.position,
        image: null, // Do not pre-fill the image field
      });
    } else {
      // Otherwise, we're adding a new employee
      setIsEditing(false);
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        position: '',
        image: null,
      });
    }
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSuccess('');
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      let response;
      if (isEditing) {
        // If editing, send a PUT request to update the employee
        response = await axios.put(`http://localhost:5000/api/employees/${editingEmployeeId}`, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          },
        });
      } else {
        // Otherwise, create a new employee
        response = await axios.post('http://localhost:5000/api/employees/register', data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          },
        });
      }
      setSuccess(response.data.message);
      setError('');
      fetchEmployees(); // Refresh employee list
      closeModal();
    } catch (error) {
      setError(error.response.data.message || 'An error occurred');
      setSuccess('');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const response = await axios.delete(`http://localhost:5000/api/employees/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          },
        });
        alert(response.data.message);
        fetchEmployees(); // Refresh the employee list
      } catch (error) {
        console.error('Error deleting employee:', error);
        alert('Failed to delete employee');
      }
    }
  };

  return (
    <div>
      <h2>Employees</h2>
      <div className="employee-list">
        <div className="employee-card add-card" onClick={() => openModal()}>
          <div className="add-icon">+</div>
          <p>Add Employee</p>
        </div>
        {employees.map((employee) => (
          <div className="employee-card" key={employee._id}>
            <img src={`http://localhost:5000/${employee.imageUrl}`} alt={employee.name} />
            <h3>{employee.name}</h3>
            <p><strong>Email:</strong> {employee.email}</p>
            <p><strong>Phone:</strong> {employee.phone}</p>
            <p><strong>Address:</strong> {employee.address}</p>
            <p><strong>Position:</strong> {employee.position}</p>
            <button onClick={() => openModal(employee)}>Edit</button> {/* Edit button */}
            <button onClick={() => handleDelete(employee._id)}>Delete</button>
          </div>
        ))}
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel={isEditing ? "Edit Employee" : "Register Employee"}
        className="modal"
        overlayClassName="overlay"
      >
        <h2>{isEditing ? "Edit Employee" : "Register New Employee"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
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
            required={!isEditing} // Password is required only when creating a new employee
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="position"
            placeholder="Position"
            value={formData.position}
            onChange={handleChange}
            required
          />
          <input type="file" name="image" onChange={handleImageChange} /> {/* Image is optional */}
          <button type="submit">{isEditing ? "Update Employee" : "Register Employee"}</button>
        </form>
        {success && <p className="success">{success}</p>}
        {error && <p className="error">{error}</p>}
        <button onClick={closeModal}>Close</button>
      </Modal>
    </div>
  );
};

export default Employees;
