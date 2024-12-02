import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Media {
  id: number;
  title: string;
  author: string;
  type: string;
  status: string;
  location: string;
  format: string;
  publicationYear: number;
}

const MediaSearch: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<Media[]>([]);
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('title');
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const queryParams = new URLSearchParams({
        query,
        type: typeFilter !== 'all' ? typeFilter : '',
        status: statusFilter !== 'all' ? statusFilter : '',
        year: yearFilter !== 'all' ? yearFilter : '',
        sort: sortBy,
      });
      const response = await axios.get<Media[]>(`/api/media/search?${queryParams.toString()}`);
      setResults(response.data);
      setError('');
    } catch (error) {
      setError('Failed to fetch search results. Please try again.');
      console.error('Search failed:', error);
    }
  };

  const handleAutocomplete = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setQuery(inputValue);

    if (inputValue.length > 2) {
      try {
        const response = await axios.get<string[]>(`/api/media/autocomplete?query=${inputValue}`);
        setAutocompleteSuggestions(response.data);
      } catch (error) {
        console.error('Autocomplete failed:', error);
      }
    } else {
      setAutocompleteSuggestions([]);
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

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Media Search</h2>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="flex gap-4 mb-6">
        <input 
          type="text" 
          value={query} 
          onChange={handleAutocomplete} 
          placeholder="Search for media" 
          aria-label="Search query"
          className="p-2 border border-gray-300 rounded-md w-1/2"
        />
        {autocompleteSuggestions.length > 0 && (
          <ul className="absolute bg-white border border-gray-300 w-1/2 mt-2 z-10 max-h-40 overflow-y-auto shadow-lg">
            {autocompleteSuggestions.map((suggestion, index) => (
              <li key={index} className="p-2 cursor-pointer hover:bg-gray-100" onClick={() => setQuery(suggestion)}>
                {suggestion}
              </li>
            ))}
          </ul>
        )}
       
        <select 
          value={yearFilter} 
          onChange={(e) => setYearFilter(e.target.value)} 
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="all">All Years</option>
          <option value="2020">2020</option>
          <option value="2021">2021</option>
          <option value="2022">2022</option>
        </select>
        <select 
          value={sortBy} 
          onChange={handleSortChange} 
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="title">Sort by Title</option>
          <option value="author">Sort by Author</option>
          <option value="publicationYear">Sort by Year</option>
        </select>
        <button 
          type="submit" 
          className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Search
        </button>
      </form>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* Search Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map(item => (
          <div 
            key={item.id} 
            className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
            <p className="text-sm text-gray-500">{item.author}</p>
            <p className="text-sm text-gray-500">{item.type}</p>
            <p className="text-sm text-gray-600 mt-2">Status: {item.status}</p>
            <p className="text-sm text-gray-600">Location: {item.location}</p>
            <p className="text-sm text-gray-600">Format: {item.format}</p>
            <p className="text-sm text-gray-600">Publication Year: {item.publicationYear}</p>
            {item.status === 'available' && (
              <button 
                onClick={() => handleBorrow(item.id)} 
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
              >
                Borrow
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaSearch;
