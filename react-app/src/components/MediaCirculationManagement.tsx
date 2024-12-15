import { MediaCirculation } from '@/types/interfaces';
import { DataGrid, GridColDef, GridColumnResizeParams, GridFilterModel, GridRenderCellParams } from '@mui/x-data-grid';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import '../assets/styles/DataGridStyles.css';

interface ColumnWidths {
  [key: string]: number;
}

const MediaCirculationManagement: React.FC = () => {

  const token = localStorage.getItem("authToken");
  const [mediaCirculationList, setMediaCirculationList] = useState<MediaCirculation[]>([]);
  const [error, setError] = useState<string>('');
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const [columnWidths, setColumnWidths] = useState<ColumnWidths>({});

  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: [
      {
        field: 'returned',
        operator: 'equals',
        value: 'No',
      },
    ],
  });

  useEffect(() => {
    fetchMediaCirculatoin();
  }, []);

  const fetchMediaCirculatoin = async () => {
    try {
      await axios.get<MediaCirculation[]>('/api/media-circulation/all', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      }).then(response => {
        setMediaCirculationList(response.data);
      })
        .catch(error => {
          console.error('Error:', error);
        });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        navigate('/login');
      } else {
        setError('Failed to fetch borrowal transaction. Please try again later.');
        console.error('Error fetching borrowal transaction:', error);
      }
    }
  };

  const handleReturnClick = async (mediaCirculationItem: MediaCirculation) => {
    try {
      await axios.post<any>('/api/media-circulation/return', {}, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: { mediaCirculationId: mediaCirculationItem.id }
      }).then(response => {
        console.log(response.data);
      })
        .catch(error => {
          console.error('Error:', error);
        });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        navigate('/login');
      } else {
        setError('Failed to fetch borrowal transaction. Please try again later.');
        console.error('Error fetching borrowal transaction:', error);
      }
    }
    setModalMessage('Media marked as returned.')
  };

  const closeModal = () => {
    setModalMessage(null);
    fetchMediaCirculatoin();// Refresh the page after dismissing the modal
  };

  const handleColumnResize = (params: GridColumnResizeParams) => {
    const { colDef, width } = params; // Destructure colDef and width from params
    const field = colDef.field;
    setColumnWidths((prevWidths) => ({
      ...prevWidths,
      [field]: width,
    }));
  };
  const columns: GridColDef[] = [
    {
      field: 'title',
      headerName: 'Title',
      flex: 1,
      valueGetter: (value, row) => { return row.inventory?.media?.title },
      renderCell: (params) => (
        <span
          title={`by ${params.row.inventory?.media?.author}`}
        >
          {params.row.inventory?.media?.title}
        </span>
      ),
    },
    {
      field: 'branch',
      headerName: 'Branch',
      flex: 1,
      valueGetter: (value, row) => { return row.inventory?.branch?.name },
      renderCell: (params) => (
        <span
          title={`${params.row.inventory?.branch?.address}, ${params.row.inventory?.branch?.city}`}
        >
          {params.row.inventory?.branch?.name}
        </span>
      ),
    },
    {
      field: 'userName',
      headerName: 'User Name',
      flex: 1,
      valueGetter: (value, row) => { return row.user?.name },
      renderCell: (params) => (
        <span
          title={params.row.user?.email}
        >
          {params.row.user?.name}
        </span>
      ),
    },
    {
      field: 'borrowDate',
      headerName: 'Borrow Date',
      flex: 1,
      valueGetter: (value, row) => { return row.borrowDate },
    },
    {
      field: 'dueDate',
      headerName: 'Due Date',
      flex: 1,
      valueGetter: (value, row) => { return row.dueDate },
    },
    {
      field: 'returned',
      headerName: 'Returned',
      flex: 1,
      valueGetter: (value, row) => { return row.returned ? "Yes" : "No" },
    },
    {
      field: 'returnDate',
      headerName: 'Return Date',
      flex: 1,
      valueGetter: (value, row) => { return row.returnDate },
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      renderCell: (params: GridRenderCellParams) => {
        const mediaCirculationItem = params.row;
        const isReturned = mediaCirculationItem.returned;
        const buttonText = isReturned ? 'Returned' : 'Mark as Returned';
        const tooltipText = isReturned 
          ? `Returned on ${mediaCirculationItem.returnDate}` 
          : '';

        return (
          <button
            type="button"
            className={`font-semibold leading-6 ${isReturned ? 'text-gray-400' : 'text-indigo-600 hover:text-indigo-500'}`}
            onClick={() => !isReturned && handleReturnClick(mediaCirculationItem)}
            disabled={isReturned}
            title={tooltipText}
          >
            {buttonText}
          </button>
        );
      },
      cellClassName: 'sticky-cell',
      headerClassName: 'sticky-header',
    },
  ];

  const updatedColumns = columns.map((col) => ({
    ...col,
    width: columnWidths[col.field] || col.width, // Apply the updated width
  }));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Media Circulation</h2>
        <div className="h-[440px] w-full">
          <div className="overflow-x-auto data-grid-container">
            <DataGrid
              sx={{
                '--DataGrid-containerBackground': '#c3d4d4',
              }}
              rows={mediaCirculationList}
              columns={updatedColumns}
              getRowId={(row) => row.id}
              pageSizeOptions={[25, 50, 100]}
              disableRowSelectionOnClick
              onColumnResize={handleColumnResize} // Track column resize
              columnBufferPx={0} // Ensure smooth resizing behavior
              filterModel={filterModel}
              onFilterModelChange={(newFilterModel) => setFilterModel(newFilterModel)}
            />
          </div>
        </div>
      
      {error && <p className="mt-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">{error}</p>}
      {modalMessage && <Modal message={modalMessage} onClose={closeModal} />}
    </div>
  );
};

export default MediaCirculationManagement;

