import React, { useState, useContext, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import AuthContext from '../contexts/AuthContext';

interface Media {
    id: number;
    title: string;
    author: string;
    genre: string;
    format: string;
    publicationYear: number;
}

const MediaSearch: React.FC = () => {
    const { isAuthenticated, logout } = useContext(AuthContext);
    const [mediaList, setMediaList] = useState<Media[]>([]);
    const [query, setQuery] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [availability, setAvailability] = useState<Record<number, boolean>>({});
    const navigate = useNavigate();

    if (!isAuthenticated) {
        console.log('Unauthenticated');
        return <Navigate to="/login" />;
    }

    const getAuthHeaders = () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            logout();
            throw new Error('Authentication token is missing.');
        }
        return { Authorization: `Bearer ${token}` };
    };

    const handleSearch = async () => {
        if (!isAuthenticated) {
            setError('You must be logged in to search media.');
            return;
        }

        try {
            const headers = getAuthHeaders();
            const response = query.trim()
                ? await axios.get(`/api/media/search?searchTerm=${query}`, { headers })
                : await axios.get('/api/media/all', { headers });
            setMediaList(response.data);
            setError('');
        } catch (error: any) {
            if (error.response?.status === 401) {
                setError('Session expired. Please log in again.');
                logout();
            } else {
                setError('Failed to fetch media.');
            }
            console.error('Error fetching media:', error);
        }
    };

    useEffect(() => {
        handleSearch(); // Execute search once when the component loads
    }, []);

    const checkAvailability = async (mediaId: number) => {
        if (availability[mediaId] !== undefined) return;

        try {
            const headers = getAuthHeaders();
            const response = await axios.get('/api/inventory/search-branches', {
                headers,
                params: { mediaId },
            });
            setAvailability((prev) => ({
                ...prev,
                [mediaId]: response.data.length > 0,
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

    const columns: GridColDef[] = [
        { field: 'title', headerName: 'Title', flex: 1 },
        { field: 'author', headerName: 'Author', flex: 1 },
        { field: 'genre', headerName: 'Genre', flex: 1 },
        { field: 'format', headerName: 'Format', flex: 1 },
        { field: 'publicationYear', headerName: 'Publication Year', flex: 1 },
        {
            field: 'action',
            headerName: 'Action',
            flex: 1,
            renderCell: (params: GridRenderCellParams) => {
                const media = params.row as Media;
                return (
                    <button
                        type="button"
                        onClick={() => handleBorrow(media)}
                        className={`font-semibold leading-6 ${availability[media.id] === false
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-indigo-600 hover:text-indigo-500'
                            }`}
                        disabled={availability[media.id] === false}
                        onMouseEnter={() => checkAvailability(media.id)}
                    >
                        {availability[media.id] === undefined
                            ? 'Checking...'
                            : availability[media.id]
                                ? 'Borrow'
                                : 'Unavailable'}
                    </button>
                );
            },
        },
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Media Search</h2>
            <form onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
            }} className="flex gap-4 mb-6">
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

            {error && (
                <p className="mt-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                    {error}
                </p>
            )}

            <div className="h-[440px] w-full mt-6">
                <DataGrid
                    sx={{
                        '--DataGrid-containerBackground': '#c3d4d4',
                    }}
                    rows={mediaList}
                    columns={columns}
                    getRowId={(row) => row.id}
                    pageSizeOptions={[25, 50, 100]}
                    disableRowSelectionOnClick
                />
            </div>
        </div>
    );
};

export default MediaSearch;
