import React from 'react';

interface ModalProps {
    message: string;
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ message, onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg w-96 p-6">
                <p className="text-gray-700 text-lg">{message}</p>
                <div className="mt-4 flex justify-end">
                    <button
                        className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
