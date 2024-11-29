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
        await axios.post('/api/users/verify-email', { token });
        setStatus('Email verified successfully!');
        setTimeout(() => navigate('/login'), 10000); 
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
      <h2>Email Verification</h2>
      {error ? (
        <p className="error" role="alert">{error}</p>
      ) : (
        <p role="status">{status}</p>
      )}
      {status === 'Email verified successfully!' && (
        <p>You will be redirected to the login page shortly. If not, please <a href="/login">click here</a>.</p>
      )}
    </div>
  );
};

export default EmailVerification;

