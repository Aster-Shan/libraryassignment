import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import Modal from './Modal'; // Import the Modal component

interface BorrowedMedia {
    id: number;
    title: string;
    author: string;
    borrowDate: string;
    dueDate: string;
    returned: boolean;
    returnDate: string;
    branchName: string;
    branchFullAddress: string;
    renewalCount: number;
}

const BorrowedMedia: React.FC = () => {
    const token = localStorage.getItem('authToken');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const user = localStorage.getItem('user');
    const [borrowedMediaList, setBorrowedMediaList] = useState<BorrowedMedia[]>([]);
    const [modalMessage, setModalMessage] = useState<string | null>(null);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        fetchBorrowedMedia();
    }, []);

    const fetchBorrowedMedia = async () => {
        const userId = user ? JSON.parse(user).id : {};
        try {
            const response = await axios.get<BorrowedMedia[]>('/api/media-circulation/search', {
                headers,
                params: { userId },
            });
            setBorrowedMediaList(response.data);
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to fetch borrowed media.');
        }
    };

    const handleRenew = async (mediaCirculationId: number) => {
        try {
            const response = await axios.post<BorrowedMedia>('/api/media-circulation/renew', {}, {
                headers,
                params: { mediaCirculationId },
            });
            setModalMessage(`Media renewed successfully. New due date: ${response.data.dueDate}`);
        } catch (error: unknown) {
            if (error instanceof AxiosError && error.response) {
                setModalMessage(`Failed to renew the media. ${error.response.data.message}`);
            } else {
                setModalMessage('Failed to renew the media. Please try again.');
            }
        }
    };

    const closeModal = () => {
        setModalMessage(null);
        window.location.reload(); // Refresh the page after dismissing the modal
    };

    const columns: GridColDef[] = [
        { field: 'title', headerName: 'Title', flex: 1 },
        { field: 'author', headerName: 'Author', flex: 1 },
        { field: 'borrowDate', headerName: 'Borrow Date', flex: 1 },
        { field: 'dueDate', headerName: 'Due Date', flex: 1 },
        { field: 'branchName', headerName: 'Branch Name', flex: 1 },
        { field: 'remainingRenewals', 
            headerName: 'Remaining Renewals', 
            flex: 1, 
            valueGetter: (value, row) => { return (row.returned)? 'N/A':2-row.renewalCount },},
        {
            field: 'action',
            headerName: 'Action',
            flex: 1,
            renderCell: (params: GridRenderCellParams) => {
                const media = params.row as BorrowedMedia;
                let buttonText = "Renew";
                let isDisabled = false;
                let tooltip = "";
    
                if (media.returned) {
                    buttonText = "Returned";
                    isDisabled = true;
                    tooltip = `Returned on ${media.returnDate}`;
                } else if (media.renewalCount > 1) {
                    buttonText = "Unrenewable";
                    isDisabled = true;
                    tooltip = "Maximum renewal reached";
                }
    
                return (
                    <button
                        type="button"
                        className={`font-semibold leading-6 ${isDisabled ? 'text-gray-400 cursor-not-allowed' : 'text-indigo-600 hover:text-indigo-500'}`}
                        onClick={() => !isDisabled && handleRenew(media.id)}
                        disabled={isDisabled}
                        title={tooltip}
                    >
                        {buttonText}
                    </button>
                );
            },
        },
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Your Borrowed Media</h2>
            <div className="h-[440px] w-full">
                <DataGrid
                    sx={{
                        '--DataGrid-containerBackground': '#c3d4d4',
                    }}
                    rows={borrowedMediaList}
                    columns={columns}
                    getRowId={(row) => row.id}
                    pageSizeOptions={[25, 50, 100]}
                    disableRowSelectionOnClick
                />
            </div>
            {error && <p className="mt-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">{error}</p>}
            {modalMessage && <Modal message={modalMessage} onClose={closeModal} />}
        </div>
    );
};

export default BorrowedMedia;
