import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

// Connect to the Socket.io server
const socket = io('http://localhost:5000'); // Update with your backend URL

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Listen for new comment events from the server
    socket.on('newComment', (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    // Clean up the event listener on component unmount
    return () => {
      socket.off('newComment');
    };
  }, []);

  const handleBellClick = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="notification-bell-container">
      <div className="notification-bell" onClick={handleBellClick}>
        <i className="bell-icon">🔔</i>
        {notifications.length > 0 && (
          <span className="notification-count">{notifications.length}</span>
        )}
      </div>
      {showDropdown && (
        <div className="notification-dropdown">
          {notifications.length === 0 ? (
            <p>No new notifications</p>
          ) : (
            notifications.map((notification, index) => (
              <div className="notification-item" key={index}>
                <p>
                  <strong>Client:</strong> {notification.clientName}
                </p>
                <p>
                  <strong>Employee:</strong> {notification.employeeName}
                </p>
                <p>
                  <strong>Comment:</strong> {notification.comment}
                </p>
                <p>
                  <small>
                    {new Date(notification.timestamp).toLocaleString()}
                  </small>
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
