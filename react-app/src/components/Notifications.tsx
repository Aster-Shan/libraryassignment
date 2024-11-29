import axios from 'axios';
import React, { useEffect, useState } from 'react';

interface Notification {
  id: number;
  message: string;
  sentAt: string;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get<Notification[]>('/api/notifications');
        setNotifications(response.data);
      } catch (error) {
        setError('Failed to fetch notifications. Please try again later.');
        console.error('Failed to fetch notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div>
      <h2>Notifications</h2>
      {error && <p className="error" role="alert">{error}</p>}
      {notifications.length === 0 && !error && <p>No notifications to display.</p>}
      <ul>
        {notifications.map(notification => (
          <li key={notification.id}>
            {notification.message} - {new Date(notification.sentAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;

