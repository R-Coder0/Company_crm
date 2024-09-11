import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ClientCommentsPopup from '../components/ClientCommentsPopup'; // Import the popup component

const EmployeeTasks = () => {
  const [assignedClients, setAssignedClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null); // State to manage selected client for popup

  useEffect(() => {
    const fetchAssignedClients = async () => {
      try {
        const token = localStorage.getItem('employeeToken');
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const employeeId = decodedToken.user.id;

        const response = await axios.get(`http://localhost:5000/api/clients/assigned/${employeeId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAssignedClients(response.data);
      } catch (error) {
        console.error('Error fetching assigned clients:', error);
      }
    };

    fetchAssignedClients();
  }, []);

  const handleClientClick = (client) => {
    setSelectedClient(client); // Set the selected client to open the popup
  };

  const handleClosePopup = () => {
    setSelectedClient(null); // Close the popup
  };

  return (
    <div className="employee-tasks">
      <h2>Assigned Clients</h2>
      {assignedClients.length > 0 ? (
        <div className="client-cards">
          {assignedClients.map((client) => (
            <div className="client-card" key={client._id} onClick={() => handleClientClick(client)}>
              <h3>{client.name}</h3>
              <p><strong>Phone:</strong> {client.contactInfo.phone}</p>
              <p><strong>Email:</strong> {client.contactInfo.email}</p>
              <p><strong>Address:</strong> {client.address}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No clients assigned yet.</p>
      )}

      {/* Render the popup if a client is selected */}
      {selectedClient && (
        <ClientCommentsPopup
          client={selectedClient}
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
};

export default EmployeeTasks;
