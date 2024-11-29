import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Media {
  id: number;
  title: string;
  type: string;
  status: string;
}

const MediaSearch: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<Media[]>([]);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.get<Media[]>(`/api/media/search?query=${query}`);
      setResults(response.data);
      setError('');
    } catch (error) {
      setError('Failed to fetch search results. Please try again.');
      console.error('Search failed:', error);
    }
  };

  const handleBorrow = async (mediaId: number) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.id) {
      navigate('/login');
      return;
    }

    try {
      await axios.post(`/api/media/borrow/${mediaId}`);
      setResults(results.map(item => 
        item.id === mediaId ? { ...item, status: 'borrowed' } : item
      ));
    } catch (error) {
      setError('Failed to borrow the item. Please try again.');
      console.error('Borrowing failed:', error);
    }
  };

  return (
    <div>
      <h2>Media Search</h2>
      <form onSubmit={handleSearch}>
        <input 
          type="text" 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          placeholder="Search for media" 
          aria-label="Search query"
        />
        <button type="submit">Search</button>
      </form>
      {error && <p className="error" role="alert">{error}</p>}
      <ul>
        {results.map(item => (
          <li key={item.id}>
            {item.title} - {item.type} - {item.status}
            {item.status === 'available' && (
              <button onClick={() => handleBorrow(item.id)}>Borrow</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MediaSearch;

