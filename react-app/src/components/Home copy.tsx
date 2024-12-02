import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface MediaStats {
  totalMedia: number;
  availableMedia: number;
  borrowedMedia: number;
}

interface UserStats {
  totalUsers: number;
  activeUsers: number;
}

const Home: React.FC = () => {
  const [mediaStats, setMediaStats] = useState<MediaStats | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [mediaResponse, userResponse] = await Promise.all([
        axios.get<MediaStats>('/api/stats/media'),
        axios.get<UserStats>('/api/stats/users')
      ]);
      setMediaStats(mediaResponse.data);
      setUserStats(userResponse.data);
    } catch (error) {
      setError('Failed to fetch library statistics. Please try again later.');
      console.error('Error fetching statistics:', error);
    }
  };

  return (
    <div className="home p-6">
      <h1 className="text-3xl font-bold mb-6">Welcome to the Advanced Media Library</h1>
      {error && <p className="error text-red-600 mb-4" role="alert">{error}</p>}
      <div className="stats-container grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="stats-section bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Media Statistics</h2>
          {mediaStats ? (
            <ul className="space-y-2">
              <li>Total Media: {mediaStats.totalMedia}</li>
              <li>Available Media: {mediaStats.availableMedia}</li>
              <li>Borrowed Media: {mediaStats.borrowedMedia}</li>
            </ul>
          ) : (
            <p>Loading media statistics...</p>
          )}
        </div>
        <div className="stats-section bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">User Statistics</h2>
          {userStats ? (
            <ul className="space-y-2">
              <li>Total Users: {userStats.totalUsers}</li>
              <li>Active Users: {userStats.activeUsers}</li>
            </ul>
          ) : (
            <p>Loading user statistics...</p>
          )}
        </div>
      </div>
      <div className="quick-links mb-8">
        <h2 className="text-2xl font-semibold mb-4">Quick Links</h2>
        <ul className="space-y-2">
          <li><Link to="/search" className="text-blue-600 hover:underline">Search Media</Link></li>
          <li><Link to="/borrowed-media" className="text-blue-600 hover:underline">View Borrowed Media</Link></li>
          <li><Link to="/profile" className="text-blue-600 hover:underline">Update Profile</Link></li>
        </ul>
      </div>
      <div className="about-section bg-white p-4 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">About AML</h2>
        <p>
          The Advanced Media Library (AML) is a state-of-the-art digital library system
          providing access to a wide range of media including books, journals, audio, and video content.
          Our mission is to make knowledge accessible to everyone, anytime, anywhere.
        </p>
      </div>
    </div>
  );
};

export default Home;