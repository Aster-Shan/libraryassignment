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
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get<UserProfile>('/api/users/profile');
        setUser(response.data);
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
    } catch (error) {
      setError('Failed to update profile. Please try again.');
      setSuccess('');
      console.error('Profile update failed:', error);
    }
  };

  return (
    <div>
      <h2>User Profile</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            value={user.name} 
            onChange={handleChange} 
            required 
            aria-label="Name"
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            value={user.email} 
            readOnly 
            aria-label="Email"
          />
        </div>
        <div>
          <label htmlFor="address">Address:</label>
          <input 
            type="text" 
            id="address" 
            name="address" 
            value={user.address} 
            onChange={handleChange} 
            required 
            aria-label="Address"
          />
        </div>
        <div>
          <label htmlFor="phone">Phone:</label>
          <input 
            type="tel" 
            id="phone" 
            name="phone" 
            value={user.phone} 
            onChange={handleChange} 
            required 
            aria-label="Phone"
          />
        </div>
        <button type="submit">Update Profile</button>
      </form>
      {error && <p className="error" role="alert">{error}</p>}
      {success && <p className="success" role="status">{success}</p>}
    </div>
  );
};

export default Profile;

