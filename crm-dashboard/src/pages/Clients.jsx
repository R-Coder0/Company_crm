import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../pages/Clients.css';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [error, setError] = useState(null); // State to track errors

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get('http://localhost:5000/api/clients', {
          headers: {
            Authorization: `Bearer ${token}`, // Correct token format
          },
        });

        setClients(response.data);
      } catch (error) {
        setError('Error fetching clients. Please try again.');
        console.error('Error fetching clients:', error.response || error);
      }
    };

    fetchClients();
  }, []);

  // Filter clients based on search term
  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle card click to open modal
  const handleCardClick = (client) => {
    setSelectedClient(client);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setSelectedClient(null);
  };

  return (
    <div>
      <h2>Clients</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="text"
        placeholder="Search clients..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="client-cards">
        {filteredClients.map((client) => (
          <div
            key={client._id}
            className="client-card"
            onClick={() => handleCardClick(client)}
          >
            <h3>{client.name}</h3>
          </div>
        ))}
      </div>

      {/* Modal for client details */}
      {selectedClient && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={handleCloseModal}>
              &times;
            </button>
            <h3>{selectedClient.name}</h3>
            <p><strong>Phone:</strong> {selectedClient.contactInfo?.phone || 'N/A'}</p>
            <p><strong>Email:</strong> {selectedClient.contactInfo?.email || 'N/A'}</p>
            <p><strong>Address:</strong> {selectedClient.address || 'N/A'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
