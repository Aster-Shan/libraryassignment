import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const EmailVerification: React.FC = () => {
  const [status, setStatus] = useState<string>('Verifying your email...');
  const [error, setError] = useState<string>('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');

      if (!token) {
        setError('Invalid verification link. Please check your email and try again.');
        return;
      }

      try {
        const API_URL = 'http://localhost:8080';
        //await axios.post('/api/users/verify-email', { token });

        const response = await axios.post(`${API_URL}/api/users/verify-email`,'',{
          params: { token : token },
          headers: {
            'Content-Type': 'application/json',
          },
        });

        setStatus('Email verified successfully!');
        setTimeout(() => navigate('/login'), 7000); 
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error.response?.data?.message || 'Email verification failed. Please try again.');
        } else {
          setError('An unexpected error occurred. Please try again later.');
        }
        console.error('Email verification error:', error);
      }
    };

    verifyEmail();
  }, [location, navigate]);

  return (
    <div className="email-verification">
      {error && (
        <div className="mt-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
          <strong>Error:</strong> {error}
        </div>
      )}
      {status === 'Email verified successfully!' && (
        <div className="mt-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4">
        <strong>Success:</strong><p>You will be redirected to the login page shortly. If not, please <a href="/login">click here</a>.</p>
        </div>
      )}
    </div>
  );
};

export default EmailVerification;

