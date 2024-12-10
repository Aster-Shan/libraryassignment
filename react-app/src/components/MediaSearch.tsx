import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Media {
    id: number;
    title: string;
    author: string;
    genre: string;
    format: string;
    publicationYear: number;
}

const MediaSearch: React.FC = () => {
    const token = localStorage.getItem('authToken');
    const [mediaList, setMediaList] = useState<Media[]>([]);
    const [query, setQuery] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [availability, setAvailability] = useState<Record<number, boolean>>({});
    const navigate = useNavigate();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) {
            setError('You must be logged in to search media.');
            return;
        }

        try {
            const response = query.trim()
                ? await axios.get(`/api/media/search?searchTerm=${query}`, { headers })
                : await axios.get('/api/media/all', { headers });
            setMediaList(response.data);
            setError('');
        } catch (error) {
            setError('Failed to fetch media.');
            setMediaList([]);
            console.error('Error:', error);
        }
    };

    const checkAvailability = async (mediaId: number) => {
        if (availability[mediaId] !== undefined) return; // Avoid redundant API calls for the same media
        try {
            const response = await axios.get('/api/inventory/search-branches', {
                headers,
                params: { mediaId },
            });
            setAvailability((prev) => ({
                ...prev,
                [mediaId]: response.data.length > 0, // Store availability
            }));
        } catch (error) {
            console.error('Error checking availability:', error);
            setAvailability((prev) => ({
                ...prev,
                [mediaId]: false,
            }));
        }
    };

    const handleBorrow = (media: Media) => {
        navigate('/borrow-media', { state: { media } });
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Media Search</h2>
            <form onSubmit={handleSearch} className="flex gap-4 mb-6">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for media"
                    aria-label="Search query"
                    className="p-2 border border-gray-300 rounded-md w-1/2"
                />
                <button
                    type="submit"
                    className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                    Search
                </button>
            </form>

            {error && <p className="text-red-600 mb-4">{error}</p>}

            <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-3 text-left text-gray-600">Title</th>
                            <th className="p-3 text-left text-gray-600">Author</th>
                            <th className="p-3 text-left text-gray-600">Genre</th>
                            {/* <th className="p-3 text-left text-gray-600">Format</th> */}
                            <th className="p-3 text-left text-gray-600">Publication Year</th>
                            <th className="p-3 text-left text-gray-600">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mediaList.length > 0 ? (
                            mediaList.map((item) => (
                                <tr key={item.id} className="border-b hover:bg-gray-100">
                                    <td className="p-3">{item.title}</td>
                                    <td className="p-3">{item.author}</td>
                                    <td className="p-3">{item.genre}</td>
                                    {/* <td className="p-3">{item.format}</td> */}
                                    <td className="p-3">{item.publicationYear}</td>
                                    <td className="p-3">
                                        <button
                                            type="button"
                                            onClick={() => handleBorrow(item)}
                                            className={`font-semibold leading-6 ${
                                                availability[item.id] === false
                                                    ? 'text-gray-400 cursor-not-allowed'
                                                    : 'text-indigo-600 hover:text-indigo-500'
                                            }`}
                                            disabled={availability[item.id] === false}
                                            onMouseEnter={() => checkAvailability(item.id)}
                                        >
                                            {availability[item.id] === undefined
                                                ? 'Checking...'
                                                : availability[item.id]
                                                ? 'Borrow'
                                                : 'Unavailable'}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="p-3 text-center">
                                    No media found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MediaSearch;
