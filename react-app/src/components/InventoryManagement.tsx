import { DataGrid, GridColDef, GridRenderCellParams, GridValueGetter } from '@mui/x-data-grid';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TransferModal from './TransferModal';
import { Branch, Inventory } from '@/types/interfaces';

const InventoryManagement: React.FC = () => {

  const token = localStorage.getItem("authToken");
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<Branch>();
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const [openTransferModal,setOpenTransferModal]  = useState(false);
  const [selectedInventory, setselectedInventory] = useState<Inventory>();

  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    if (selectedBranch) {
      fetchInventory(selectedBranch.id);
    }
  }, [selectedBranch]);

  const fetchBranches = async () => {
    try {
      await axios.get<Branch[]>('/api/branches/all', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).then(response => {
        setBranches(response.data);
      })
        .catch(error => {
          console.error('Error:', error);
        });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        navigate('/login');
      } else {
        setError('Failed to fetch branches. Please try again later.');
        console.error('Error fetching branches:', error);
      }
    }
  };

  const fetchInventory = async (branchId: number) => {
    try {
      await axios.get<Inventory[]>('/api/inventory/by-branch-id', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: { branchId: branchId }
      }).then(response => {
        setInventory(response.data);
      })
        .catch(error => {
          console.error('Error:', error);
        });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        navigate('/login');
      } else {
        setError('Failed to fetch branches. Please try again later.');
        console.error('Error fetching branches:', error);
      }
    }
  };

  const handleTransferClick = async (inventory: Inventory) => {
    setselectedInventory(inventory);
    setOpenTransferModal(true);
  };

  const closeTransferModal = () => {
    setOpenTransferModal(false);
    setselectedInventory(undefined);
    fetchInventory(selectedBranch!.id);
  };

  const columns: GridColDef[] = [
    {
      field: 'title',
      headerName: 'Title',
      flex: 1,
      valueGetter: (value, row) => { return row.media?.title },
    },
    {
      field: 'author',
      headerName: 'Author',
      flex: 1,
      valueGetter: (value, row) => { return row.media?.author },
    },
    {
      field: 'format',
      headerName: 'Format',
      flex: 1,
      valueGetter: (value, row) => { return row.media?.format },
    },
    { field: 'status', headerName: 'Status', flex: 1 },
    { field: 'renewalCount', headerName: 'Renewal Count', flex: 1 },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      renderCell: (params: GridRenderCellParams) => {
        const inventoryItem = params.row;
        return (
          <button
            title = {inventoryItem.status=='borrowed'?'Cannot transfer borrowed media.':''}
            disabled = {inventoryItem.status=='borrowed'}
            type="button"
            className={`font-semibold leading-6 ${inventoryItem.status=='borrowed'
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-indigo-600 hover:text-indigo-500'
              }`}
            onClick={() => handleTransferClick(inventoryItem)}
          >
            Transfer
          </button>
        );
      },
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Inventory</h2>
      <div className="mb-6">
        <label
          htmlFor="branch"
          className="block text-gray-700 font-medium mb-2"
        >
          From Branch
        </label>
        <select
          defaultValue=""
          id="branch"
          value={selectedBranch?.id}
          onChange={(e) => {
            const branchId = Number(e.target.value);
            const branch = branches.find(b => b.id === branchId);
            setSelectedBranch(branch);
          }}
          className="border border-gray-300 rounded-md p-3 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>
            Select a branch
          </option>
          {branches.length > 0 ? (
            branches.map((branch) => (
              <option
                key={branch.id}
                value={branch.id}
                title={branch.address + ", " + branch.city}
              >
                {branch.name}
              </option>
            ))
          ) : (
            <option disabled>No branches found.</option>
          )}
        </select>
      </div>
      {inventory.length === 0 ? (
        <p>No inventory items to display.</p>
      ) : (
        <div className="h-[440px] w-full">
          <DataGrid
            sx={{
              '--DataGrid-containerBackground': '#c3d4d4',
            }}
            rows={inventory}
            columns={columns}
            getRowId={(row) => row.id}
            pageSizeOptions={[25, 50, 100]}
            disableRowSelectionOnClick
          />
        </div>
      )}
      {error && <p className="mt-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">{error}</p>}
      {selectedInventory &&
        <TransferModal
          parentBranch = {selectedBranch!}
          branches={branches}
          inventory={selectedInventory!}
          open={openTransferModal}
          onClose={() => {closeTransferModal()}}
        />}

    </div>
  );
};


export default InventoryManagement;