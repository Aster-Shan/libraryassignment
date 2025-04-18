import { User } from '@/types/interfaces';
import axios from 'axios';
import React, { useState } from 'react';

interface PasswordChangeRequest {
    user: User;
    oldPassword: string;
    newPassword: string;
}

const ChangePassword: React.FC = () => {
    const originalUser = JSON.parse(localStorage.getItem('user')!);
    const token = localStorage.getItem('authToken');
    const [request, setRequest] = useState<PasswordChangeRequest>({
        user: originalUser,
        oldPassword: '',
        newPassword: '',
    });
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRequest({
            ...request,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await axios.post<User>('/api/users/update-password', request, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            localStorage.setItem('user', JSON.stringify(response.data));
            setSuccess('Password updated successfully');
            setTimeout(() => window.location.reload(), 2250);
        } catch (err: any) {
            // Streamline error handling
            if (err.response && err.response.data) {
                setError(err.response.data.message || 'Failed to change password. Please try again.');
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
            console.error('Password change failed:', err);
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 sm:p-6 lg:p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Change Password</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Old password */}
                <div>
                    <label htmlFor="oldPassword" className="block text-base font-medium text-gray-900">
                        Old Password:
                    </label>
                    <input
                        type="password"
                        id="oldPassword"
                        name="oldPassword"
                        value={request.oldPassword}
                        onChange={handleChange}
                        required
                        aria-label="Old Password"
                        className="mt-2 block w-full px-3 py-2 rounded-md shadow-sm sm:text-base border-2 border-gray-800 focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {/* New password */}
                <div>
                    <label htmlFor="newPassword" className="block text-base font-medium text-gray-900">
                        New Password:
                    </label>
                    <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={request.newPassword}
                        onChange={handleChange}
                        required
                        aria-label="New Password"
                        className="mt-2 block w-full px-3 py-2 rounded-md shadow-sm sm:text-base border-2 border-gray-800 focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div className="flex justify-end space-x-4 mt-4">
                    <button
                        type="submit"
                        className="px-4 py-2 text-base font-semibold text-white bg-indigo-600 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Change Password
                    </button>
                </div>
            </form>

            {/* Display Success or Error messages */}
            {error && <div className="mt-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">{error}</div>}
            {success && <div className="mt-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4">{success}</div>}
        </div>
    );
};

export default ChangePassword;
