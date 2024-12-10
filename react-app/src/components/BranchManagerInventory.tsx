import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Media {
  id: number;
  title: string;
  type: string;
  status: string;
  branch: {
    id: number;
    name: string;
  };
}
interface Branch {
  id: number;
  name: string;
}

const BranchManagerInventory: React.FC = () => {
  const token = localStorage.getItem('authToken');
  const [inventory, setInventory] = useState<Media[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<number | ''>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    if (selectedBranch) {
      fetchInventory(selectedBranch);
    }
  }, [selectedBranch]);

  const fetchBranches = async () => {
    try {
      await axios.get<Branch[]>('/api/branches',{
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).then(response => {
        setBranches(response.data);
        if (response.data.length > 0) {
          setSelectedBranch(response.data[0].id);
        }
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
      const response = await axios.get<Media[]>(`/api/branch-manager/inventory/${branchId}`);
      setInventory(response.data);
    } catch (error) {
      setError('Failed to fetch inventory. Please try again later.');
      console.error('Error fetching inventory:', error);
    }
  };

  const handleBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBranch(Number(e.target.value));
  };

  return (
    <div className="branch-manager-inventory">
      <h2>Branch Inventory</h2>
      {error && <p className="error" role="alert">{error}</p>}
      <div className="branch-selector">
        <label htmlFor="branch-select">Select Branch:</label>
        <select
          id="branch-select"
          value={selectedBranch}
          onChange={handleBranchChange}
        >
          <option value="">Select a branch</option>
          {branches.map(branch => (
            <option key={branch.id} value={branch.id}>{branch.name}</option>
          ))}
        </select>
      </div>
      {inventory.length === 0 ? (
        <p>No inventory items to display.</p>
      ) : (
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map(item => (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>{item.type}</td>
                <td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};


export default BranchManagerInventory;

