import  { useState, useEffect } from "react";
import axios from "axios";
import "./ClientAssignment.css";
import Modal from "react-modal";

const ClientAssignment = () => {
  const [employees, setEmployees] = useState([]);
  const [clients, setClients] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedClients, setSelectedClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [reviewModalIsOpen, setReviewModalIsOpen] = useState(false);
  const [modalEmployee, setModalEmployee] = useState(null);
  const [modalAssignedClients, setModalAssignedClients] = useState([]);
  const [selectedClientForReview, setSelectedClientForReview] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get("http://localhost:5000/api/employees", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEmployees(response.data);
    };

    const fetchClients = async () => {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get("http://localhost:5000/api/clients", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setClients(response.data);
    };

    const fetchAssignments = async () => {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(
        "http://localhost:5000/api/clients/assignments",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAssignments(response.data);
    };

    fetchEmployees();
    fetchClients();
    fetchAssignments();
  }, []);

  const handleAssign = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.post(
        "http://localhost:5000/api/clients/assign/bulk",
        {
          clientIds: selectedClients,
          employeeId: selectedEmployee,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Clients assigned successfully");
      setSelectedEmployee("");
      setSelectedClients([]);
      setAssignments(); // Refresh the assignments list after assignment
    } catch (error) {
      console.error("Error assigning clients:", error);
      alert("Failed to assign clients");
    }
  };

  const handleUnassign = async (clientId) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.put(
        `http://localhost:5000/api/clients/${clientId}/unassign`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Client unassigned successfully");
      setAssignments(); // Re-fetch the current assignments
    } catch (error) {
      console.error("Error unassigning client:", error);
      alert("Failed to unassign client");
    }
  };

  const handleOpenModal = (employee) => {
    setModalEmployee(employee);
    const assignedClients = assignments.filter(
      (assignment) =>
        assignment.assignedTo && assignment.assignedTo._id === employee._id
    );
    setModalAssignedClients(assignedClients);
    setModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
    setModalAssignedClients([]);
  };

  const handleReviewClick = async (client) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(
        `http://localhost:5000/api/clients/${client._id}/comments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments(response.data.callLogs || []);
      setSelectedClientForReview(client);
      setReviewModalIsOpen(true);
    } catch (error) {
      console.error("Error fetching client comments:", error);
    }
  };

  const handleCloseReviewModal = () => {
    setReviewModalIsOpen(false);
    setComments([]);
    setSelectedClientForReview(null);
  };

  // Filter clients based on search term
  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!client.assignedTo || client.assignedTo._id !== selectedEmployee)
  );

  return (
    <div className="client-assignment">
      <h2>Assign Clients to Employees</h2>
      <div className="assignment-section">
        <label>Select Employee:</label>
        <select
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
        >
          <option value="">Select Employee</option>
          {employees.map((employee) => (
            <option key={employee._id} value={employee._id}>
              {employee.name}
            </option>
          ))}
        </select>
      </div>

      <div className="assignment-section">
        <label>Search Clients:</label>
        <input
          type="text"
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="assignment-section">
        <label>Select Clients:</label>
        <select
          multiple
          value={selectedClients}
          onChange={(e) =>
            setSelectedClients(
              Array.from(e.target.selectedOptions, (option) => option.value)
            )
          }
          className="client-select"
        >
          {filteredClients.map((client) => (
            <option key={client._id} value={client._id}>
              {client.name}
            </option>
          ))}
        </select>
      </div>

      <button onClick={handleAssign} className="assign-button">
        Assign Clients
      </button>

      <h3>Current Assignments</h3>
      <div className="assignments-list">
        {employees.map((employee) => (
          <div key={employee._id} className="employee-assignment">
            <p>
              <strong>{employee.name}</strong>
              <button
                className="view-tasks-button"
                onClick={() => handleOpenModal(employee)}
              >
                View Tasks
              </button>
            </p>
          </div>
        ))}
      </div>

      {/* Modal for viewing and unassigning tasks */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleCloseModal}
        contentLabel="Assigned Tasks"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Tasks assigned to {modalEmployee?.name}</h2>
        <ul>
          {modalAssignedClients.map((client) => (
            <li key={client._id} className="assigned-task">
              {client.name}
              <button
                className="unassign-button"
                onClick={() => handleUnassign(client._id)}
              >
                Unassign
              </button>
              <button
                className="review-button"
                onClick={() => handleReviewClick(client)}
                disabled={!client.callLogs || client.callLogs.length === 0} // Disable if no comments
              >
                Review
              </button>
            </li>
          ))}
        </ul>
        <button onClick={handleCloseModal} className="close-modal-button">
          Close
        </button>
      </Modal>

      {/* Review Modal */}
      <Modal
        isOpen={reviewModalIsOpen}
        onRequestClose={handleCloseReviewModal}
        contentLabel="Client Comments"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>
          Client Comments for {selectedClientForReview?.name} ·{" "}
          {selectedClientForReview?.link}
        </h2>
        {comments.length > 0 ? (
          comments.map((log, index) => (
            <div key={index} className="comment-log">
              <p>
                <strong>Comment:</strong> {log.comment}
              </p>
              <p>
                <strong>Status:</strong> {log.callStatus}
              </p>
              {log.screenshotUrl && (
                <img
                  src={`http://localhost:5000/${log.screenshotUrl}`}
                  alt="Screenshot"
                  className="comment-screenshot"
                />
              )}
            </div>
          ))
        ) : (
          <p>No comments available.</p>
        )}
        <button onClick={handleCloseReviewModal} className="close-modal-button">
          Close
        </button>
      </Modal>
    </div>
  );
};

export default ClientAssignment;
