import { CalendarDaysIcon, HandRaisedIcon } from '@heroicons/react/24/outline';
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
              <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:max-w-none lg:grid-cols-2">
                <div className="max-w-xl lg:max-w-lg">
                  <h3 className="text-2xl font-semibold text-white">{media.title}</h3>
                  <p>Type: {media.type}</p>
                  <p>Status: {media.status}</p>
                  <p>Due Date: {new Date(media.dueDate).toLocaleDateString()}</p>
                  {media.status === 'Returned' && (
                    <p>Return Date: {new Date(media.dueDate).toLocaleDateString()}</p>
                  )}
                  <div className="media-actions mt-4 flex gap-x-4">
                    <button
                      className="rounded-md bg-red-500 px-3 py-2 text-white hover:bg-red-400"
                      onClick={() => handleReturn(media.id)}
                    >
                      Return
                    </button>
                    {media.renewalCount < 2 && (
                      <button
                        className="rounded-md bg-indigo-500 px-3 py-2 text-white hover:bg-indigo-400"
                        onClick={() => handleRenew(media.id)}
                      >
                        Renew
                      </button>
                    )}
                    {media.renewalCount >= 2 && (
                      <span className="text-sm text-gray-400">Maximum renewals reached</span>
                    )}
                  </div>
                </div>
                <dl className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:pt-2">
                  <div className="flex flex-col items-start">
                    <div className="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                      <CalendarDaysIcon aria-hidden="true" className="text-white" />
                    </div>
                    <dt className="mt-4 text-base font-semibold text-white">Due Date</dt>
                    <dd className="mt-2 text-base text-gray-400">
                      {new Date(media.dueDate).toLocaleDateString()}
                    </dd>
                  </div>
                  <div className="flex flex-col items-start">
                    <div className="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                      <HandRaisedIcon aria-hidden="true" className="text-white" />
                    </div>
                    <dt className="mt-4 text-base font-semibold text-white">Renewal Count</dt>
                    <dd className="mt-2 text-base text-gray-400">
                      {media.renewalCount} {media.renewalCount >= 2 ? 'Max reached' : ''}
                    </dd>
                  </div>
                </dl>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BorrowedMedia;
