import axios from 'axios';
import React, { useState } from 'react';

interface TransferData {
  mediaId: string;
  fromBranchId: string;
  toBranchId: string;
}

const MediaTransfer: React.FC = () => {
  const [transfer, setTransfer] = useState<TransferData>({
    mediaId: '',
    fromBranchId: '',
    toBranchId: ''
  });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTransfer({ ...transfer, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/branch-manager/transfer', null, { params: transfer });
      setSuccess('Media transferred successfully');
      setError('');
      // Reset form after successful transfer
      setTransfer({ mediaId: '', fromBranchId: '', toBranchId: '' });
    } catch (error) {
      setError('Failed to transfer media. Please check the IDs and try again.');
      setSuccess('');
      console.error('Media transfer failed:', error);
    }
  };

  return (
    <div>
      <h2>Media Transfer</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="mediaId">Media ID:</label>
          <input 
            type="text" 
            id="mediaId" 
            name="mediaId" 
            value={transfer.mediaId} 
            onChange={handleChange} 
            required 
            aria-label="Media ID"
          />
        </div>
        <div>
          <label htmlFor="fromBranchId">From Branch ID:</label>
          <input 
            type="text" 
            id="fromBranchId" 
            name="fromBranchId" 
            value={transfer.fromBranchId} 
            onChange={handleChange} 
            required 
            aria-label="From Branch ID"
          />
        </div>
        <div>
          <label htmlFor="toBranchId">To Branch ID:</label>
          <input 
            type="text" 
            id="toBranchId" 
            name="toBranchId" 
            value={transfer.toBranchId} 
            onChange={handleChange} 
            required 
            aria-label="To Branch ID"
          />
        </div>
        <button type="submit">Transfer Media</button>
      </form>
      {error && <p className="error" role="alert">{error}</p>}
      {success && <p className="success" role="status">{success}</p>}
    </div>
  );
};

export default MediaTransfer;

