import { Notification } from '@/types/interfaces';
import AuthContext from '../contexts/AuthContext';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';

const Notifications: React.FC = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState<string>('');

  const elapsedTime = (dateString: string): string => {
    const givenDate = new Date(dateString);
    const now = new Date();
    const diffInMilliseconds = now.getTime() - givenDate.getTime(); // Time difference in milliseconds

    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);

    if (diffInSeconds < 60) {
      return "now"; // Below 1 minute
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`; // Below 1 hour
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`; // Below 1 day
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`; // Below 1 week
    } else {
      return `${diffInWeeks} week${diffInWeeks !== 1 ? 's' : ''} ago`; // Highest unit is weeks
    }
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      logout();
      throw new Error('Authentication token is missing.');
    }
    return { Authorization: `Bearer ${token}` };
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      const headers = getAuthHeaders();
      try {
        const response = await axios.get<Notification[]>('/api/notifications', { headers });
        setNotifications(response.data);
      } catch (error) {
        setError('Failed to fetch notifications. Please try again later.');
        console.error('Failed to fetch notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Your Notifications</h2>
      {error && <p className="error" role="alert">{error}</p>}
      <table className="table-auto w-full mb-8 border border-gray-300 shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr className="text-left text-gray-700 text-sm tracking-wider">
            <th className="px-4 py-2 border-b border-gray-300">Message</th>
            <th className="px-4 py-2 border-b border-gray-300">Media Title</th>
            <th className="px-4 py-2 border-b border-gray-300">Due On</th>
            <th className="px-4 py-2 border-b border-gray-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
              >
                <path
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v3a1 1 0 00.293.707l2 2a1 1 0 101.414-1.414L11 8.586V6z"
                />
              </svg>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <tr className="hover:bg-gray-50 transition-colors" key={notification.id}>
                <td className="px-4 py-3 text-gray-700">{notification.message.template}</td>
                <td className="px-4 py-3 text-gray-700">{notification.transaction.inventory.media.title}</td>
                <td className="px-4 py-3 text-gray-700">{notification.transaction.dueDate.toLocaleString()}</td>
                <td className="px-4 py-3 text-gray-600">
                  {elapsedTime(notification.sentAt)}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={4}
                className="px-4 py-3 text-center text-gray-600 italic"
              >
                You are all caught up.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div >
  );
};

export default Notifications;

