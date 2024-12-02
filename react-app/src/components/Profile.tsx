import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
  name: string;
  email: string;
  address: string;
  phone: string;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<UserProfile>({
    name: '',
    email: '',
    address: '',
    phone: ''
  });
  const [originalUser, setOriginalUser] = useState<UserProfile>({
    name: '',
    email: '',
    address: '',
    phone: ''
  });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false); // To toggle edit mode
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get<UserProfile>('/api/users/profile');
        setUser(response.data);
        setOriginalUser(response.data); // Store the original profile data
      } catch (error) {
        setError('Failed to fetch user profile. Please try again later.');
        console.error('Failed to fetch user profile:', error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          navigate('/login');
        }
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.put<UserProfile>('/api/users/update', user);
      setUser(response.data);
      setSuccess('Profile updated successfully');
      setError('');
      setIsEditing(false); // Exit edit mode after successful update
    } catch (error) {
      setError('Failed to update profile. Please try again.');
      setSuccess('');
      console.error('Profile update failed:', error);
    }
  };

  const handleCancel = () => {
    setUser(originalUser); // Revert to the original data
    setIsEditing(false); // Exit edit mode without saving
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <h2 className="text-2xl font-semibold text-gray-900">User Profile</h2>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name:</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            value={user.name} 
            onChange={handleChange} 
            required 
            aria-label="Name"
            disabled={!isEditing} // Disable field if not in edit mode
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            value={user.email} 
            readOnly // Email should not be editable
            aria-label="Email"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address:</label>
          <input 
            type="text" 
            id="address" 
            name="address" 
            value={user.address} 
            onChange={handleChange} 
            required 
            aria-label="Address"
            disabled={!isEditing} // Disable field if not in edit mode
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone:</label>
          <input 
            type="text" 
            id="phone" 
            name="phone" 
            value={user.phone} 
            onChange={handleChange} 
            required 
            aria-label="Phone"
            disabled={!isEditing} // Disable field if not in edit mode
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="flex justify-end space-x-4">
          {isEditing ? (
            <>
              <button 
                type="submit" 
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save Changes
              </button>
              <button 
                type="button" 
                onClick={handleCancel} 
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-gray-200 border border-transparent rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </>
          ) : (
            <button 
              type="button" 
              onClick={() => setIsEditing(true)} 
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Edit Profile
            </button>
          )}
        </div>
      </form>
      {error && <div className="mt-4 text-sm text-red-600">{error}</div>}
      {success && <div className="mt-4 text-sm text-green-600">{success}</div>}
    </div>
  );
};

export default Profile;
