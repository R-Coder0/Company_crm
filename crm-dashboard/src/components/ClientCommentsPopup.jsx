import  { useState } from 'react';
import axios from 'axios';
import './ClientCommentsPopup.css';

// eslint-disable-next-line react/prop-types
const ClientCommentsPopup = ({ client, onClose }) => {
  const [comment, setComment] = useState('');
  const [callStatus, setCallStatus] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!comment || !callStatus) {
      setError('Comment and Call Status are required.');
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append('comment', comment);
      formData.append('callStatus', callStatus);
      if (screenshot) {
        formData.append('screenshotUrl', screenshot);
      }
  
      // Log formData for debugging
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }
  
      const token = localStorage.getItem('employeeToken');
  
      const response = await axios.post(
        `http://localhost:5000/api/clients/${client._id}/comment`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.status === 200) {
        onClose(); // Close the popup after successful submission
      }
    } catch (error) {
      setError('Failed to submit comment. Please check all fields.');
      console.error(error); // Log detailed error for debugging
    }
  };
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        {/* // eslint-disable-next-line react/prop-types */}
        <h3>Client: {client.name}</h3>
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="Enter comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          ></textarea>

          <select value={callStatus} onChange={(e) => setCallStatus(e.target.value)} required>
            <option value="">Select Call Status</option>
            <option value="call done">Call Done</option>
            <option value="call not received">Call Not Received</option>
            <option value="meeting fixed">Meeting Fixed</option>
          </select>

          <input type="file" onChange={(e) => setScreenshot(e.target.files[0])} />

          <button type="submit">Submit Comment</button>
          {error && <p className="error">{error}</p>}
        </form>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ClientCommentsPopup;
