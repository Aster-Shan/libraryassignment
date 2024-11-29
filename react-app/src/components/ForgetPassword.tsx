import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/users/forgot-password', { email });
      setMessage('Password reset email sent. Please check your inbox.');
    } catch (error) {
      setError('Error sending password reset email. Please try again.');
      console.error('Forgot password failed:', error);
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleChange}
            required
            aria-label="Email"
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      {error && <p className="error" role="alert">{error}</p>}
      {message && <p className="message" role="alert">{message}</p>}
    </div>
  );
};

export default ForgotPassword;
