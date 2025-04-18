import { User } from '@/types/interfaces';
import axios from 'axios';
import React, { useState } from 'react';

const Profile: React.FC = () => {
  const originalUser = JSON.parse(localStorage.getItem('user')!);
  const token = localStorage.getItem('authToken');
  const [user, setUser] = useState<User>(originalUser); // Current user data
  const [isEditing, setIsEditing] = useState<boolean>(false); // Edit mode flag
  const [error, setError] = useState<string>(''); // Error message
  const [success, setSuccess] = useState<string>(''); // Success message

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.put<User>('/api/users/update', user, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      localStorage.setItem('user',JSON.stringify(response.data));
      setSuccess('Profile updated successfully');
      setError('');
      setIsEditing(false);
      setTimeout(() => window.location.reload(), 2250);
    } catch (error) {
      setError('Failed to update profile. Please try again.');
      setSuccess('');
      console.error('Profile update failed:', error);
    }
  };

  const handleCancel = () => {
    setUser(originalUser);
    setIsEditing(false);
  };

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 lg:p-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">User Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Name Input */}
        <div>
          <label htmlFor="name" className="block text-base font-medium text-gray-900">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={user.name}
            onChange={handleChange}
            disabled={!isEditing}
            required
            aria-label="Name"
            className={`mt-2 block w-full px-3 py-2 rounded-md shadow-sm sm:text-base 
                        ${isEditing ? 'border-2 border-gray-800 focus:ring-2 focus:ring-indigo-500' : 'border-2 border-gray-300 bg-gray-100'}`}
          />
        </div>

        {/* Email Input (Read-Only) */}
        <div>
          <label htmlFor="email" className="block text-base font-medium text-gray-900">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={user.email}
            readOnly
            aria-label="Email"
            className="mt-2 block w-full px-3 py-2 rounded-md border-2 border-gray-300 bg-gray-100 shadow-sm sm:text-base"
          />
        </div>

        {/* Address Input */}
        <div>
          <label htmlFor="address" className="block text-base font-medium text-gray-900">Address:</label>
          <input
            type="text"
            id="address"
            name="address"
            value={user.address}
            onChange={handleChange}
            disabled={!isEditing}
            required
            aria-label="Address"
            className={`mt-2 block w-full px-3 py-2 rounded-md shadow-sm sm:text-base 
                        ${isEditing ? 'border-2 border-gray-800 focus:ring-2 focus:ring-indigo-500' : 'border-2 border-gray-300 bg-gray-100'}`}
          />
        </div>

        {/* Phone Input */}
        <div>
          <label htmlFor="phone" className="block text-base font-medium text-gray-900">Phone:</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={user.phone}
            onChange={handleChange}
            disabled={!isEditing}
            required
            aria-label="Phone"
            className={`mt-2 block w-full px-3 py-2 rounded-md shadow-sm sm:text-base 
                        ${isEditing ? 'border-2 border-gray-800 focus:ring-2 focus:ring-indigo-500' : 'border-2 border-gray-300 bg-gray-100'}`}
          />
        </div>

        {/* Save and Cancel buttons */}
        {isEditing && (
          <div className="flex justify-end space-x-4 mt-4">
            <button
              type="submit"
              className="px-4 py-2 text-base font-semibold text-white bg-indigo-600 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-base font-semibold text-gray-600 bg-gray-200 rounded-md shadow-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
        )}
      </form>

      {/* Edit Profile Button */}
      {!isEditing && (
        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 text-base font-semibold text-white bg-indigo-600 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Edit Profile
          </button>
        </div>
      )}

      {/* Display Success or Error messages */}
      {error &&  <div className="mt-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">{error}</div>}
      {success &&  <div className="mt-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4">{success}</div>}
    </div>
  );
};

export default Profile;
