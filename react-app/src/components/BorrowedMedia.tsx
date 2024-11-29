import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleApiError } from '../utils/apiUtils';

interface Media {
  id: number;
  title: string;
  type: string;
  status: string;
  dueDate: string;
  renewalCount: number;
}

const BorrowedMedia: React.FC = () => {
  const [borrowedMedia, setBorrowedMedia] = useState<Media[]>([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBorrowedMedia();
  }, []);

  const fetchBorrowedMedia = async () => {
    try {
      const response = await axios.get('/api/media/borrowed');
      setBorrowedMedia(response.data);
    } catch (error) {
      setError(handleApiError(error));
    }
  };

  const handleReturn = async (mediaId: number) => {
    try {
      await axios.post(`/api/media/return/${mediaId}`);
      setBorrowedMedia(prevMedia => prevMedia.filter(media => media.id !== mediaId));
      setSuccessMessage('Media returned successfully');
    } catch (error) {
      setError('Failed to return the media. Please try again.');
      console.error('Error returning media:', error);
    }
  };
  const handleRenew = async (mediaId: number) => {
    try {
      const response = await axios.post<Media>(`/api/media/renew/${mediaId}`);
      setBorrowedMedia(prevMedia =>
        prevMedia.map(media =>
          media.id === mediaId ? response.data : media
        )
      );
      setSuccessMessage(`Media renewed successfully. New due date: ${response.data.dueDate}`);
    } catch (error) {
      setError('Failed to renew the media. Please try again.');
      console.error('Error renewing media:', error);
    }
  };
  return (
    <div className="borrowed-media">
      <h2>Your Borrowed Media</h2>
      {error && <p className="error" role="alert">{error}</p>}
      {successMessage && <p className="success" role="status">{successMessage}</p>}
      {borrowedMedia.length === 0 ? (
        <p>You have no borrowed media at the moment.</p>
      ) : (
        <ul>
          {borrowedMedia.map(media => (
            <li key={media.id} className="media-item">
              <h3>{media.title}</h3>
              <p>Type: {media.type}</p>
              <p>Due Date: {new Date(media.dueDate).toLocaleDateString()}</p>
              <div className="media-actions">
                <button onClick={() => handleReturn(media.id)}>Return</button>
                {media.renewalCount < 2 && (
                  <button onClick={() => handleRenew(media.id)}>Renew</button>
                )}
                {media.renewalCount >= 2 && (
                  <span className="max-renewals">Maximum renewals reached</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BorrowedMedia;

