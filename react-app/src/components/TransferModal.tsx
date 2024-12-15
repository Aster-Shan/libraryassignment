import React, { useState } from 'react';
import { Branch, Inventory } from '@/types/interfaces';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TransferModal: React.FC<{ branches: Branch[]; parentBranch: Branch; inventory: Inventory; open: boolean; onClose: () => void }> = ({ branches, parentBranch, inventory, open, onClose }) => {
    const [selectedBranch, setSelectedBranch] = useState<Branch>();
    const [isTransferConfirmed, setIsTransferConfirmed] = useState(false);
    const token = localStorage.getItem("authToken");
    const navigate = useNavigate();
    const [error, setError] = useState<string>('');

    if (!open) return null;

    const handleTransfer = async (inventory: Inventory, tobranch : Branch) => {
        try {
            await axios.post<Inventory>('/api/inventory/transfer', {},{
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`
              },
              params: {inventoryId: inventory.id, toBranchId: tobranch.id }
            }).then(response => {
              console.log('Media transfered Successfully!!!');
              console.log(response.data);
            })
              .catch(error => {
                console.error('Error:', error);
              });
          } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
              navigate('/login');
            } else {
              setError('Failed to transfer media. Please try again later.');
              console.error('Error transfering media:', error);
            }
          }
    
        console.log('Transferring media:', inventory);
    };
    

    const handleConfirm = () => {
        handleTransfer(inventory,selectedBranch!);
        setIsTransferConfirmed(true);

        // Wait for confirmation message before closing modal
        setTimeout(() => {
            setIsTransferConfirmed(false);
            onClose();
        }, 2000);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg w-96 p-6">
                <h2 className="text-2xl font-semibold mb-4">Transfer Media</h2>
                <div className="mb-4">
                    <label htmlFor="branch" className="block text-sm font-medium mb-2">Select Branch</label>
                    <select
                        id="branch"
                        defaultValue={selectedBranch?.id || ''}
                        onChange={(e) => {
                            const branchId = Number(e.target.value);
                            const branch = branches.find(b => b.id === branchId);
                            setSelectedBranch(branch);
                        }}
                        className="border border-gray-300 rounded-md p-3 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="" disabled>Select a branch</option>
                        {branches
                            .filter(branch => branch.id !== parentBranch?.id) // Exclude the parentBranch
                            .map(branch => (
                                <option key={branch.id} value={branch.id}>
                                    {branch.name}
                                </option>
                            ))}
                    </select>
                </div>
                <div className="flex flex-col gap-3">
                    <button
                        type="button"
                        className="w-full bg-indigo-600 text-white py-3 px-4 rounded hover:bg-indigo-700"
                        onClick={handleConfirm}
                    >
                        Confirm Transfer
                    </button>
                    <button
                        type="button"
                        className="w-full bg-gray-100 text-gray-700 border-2 border-gray-400 py-3 px-4 rounded hover:bg-gray-200"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
                {isTransferConfirmed && (
                    <div className="mt-4 text-center text-green-600">
                        <p>Transfer Successful!</p>
                    </div>
                )}
            </div>
        </div>

    );
};


export default TransferModal;