import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface Branch {
    id: string;
    name: string;
    address: string;
    city: string;
}

const BorrowMedia: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { media } = location.state || {};
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("user");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const [branches, setBranches] = useState<Branch[]>([]);
    const [selectedBranch, setSelectedBranch] = useState("");
    const [error, setError] = useState<string>("");
    const [dialogData, setDialogData] = useState<any>(null);

    useEffect(() => {
        const fetchBranchOptions = async () => {
            try {
                const response = await axios.get("/api/inventory/search-branches", {
                    method: "GET",
                    headers,
                    params: { mediaId: media?.id },
                });
                setBranches(response.data);
            } catch (error) {
                console.error("Error fetching branch options:", error);
            }
        };
        if (media?.id) fetchBranchOptions();
    }, [media?.id]);

    if (!media) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <p className="text-gray-600 text-lg">
                    No media selected. Please go back and select a media to borrow.
                </p>
            </div>
        );
    }

    const handleBorrow = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!token) {
            setError('You must be logged in to search media.');
            return;
        }
        try {
            console.log(headers);
            const userId = user ? JSON.parse(user).id : {};
            const response = await axios.post("/api/inventory/borrow", {}, {
                method: "POST",
                headers,
                params: { mediaId: media?.id, branchId: selectedBranch, userId: userId },
            });
            setDialogData(response.data); 
        } catch (error) {
            console.error("Error Borrowing book", error);
        }
    };

    const handleDialogConfirm = () => {
        setDialogData(null); 
        navigate('/borrowed-media'); 
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <form onSubmit={handleBorrow}>
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Borrow Media</h1>
                <table className="table-auto w-full mb-8 border-collapse border border-gray-200">
                    <tbody>
                        <tr className="border-b border-gray-200">
                            <td className="font-medium text-gray-700 py-3 pr-6">Title</td>
                            <td className="text-gray-700 py-3">{media.title}</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                            <td className="font-medium text-gray-700 py-3 pr-6">Author</td>
                            <td className="text-gray-700 py-3">{media.author}</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                            <td className="font-medium text-gray-700 py-3 pr-6">Genre</td>
                            <td className="text-gray-700 py-3">{media.genre}</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                            <td className="font-medium text-gray-700 py-3 pr-6">Publication Year</td>
                            <td className="text-gray-700 py-3">{media.publicationYear}</td>
                        </tr>
                    </tbody>
                </table>
                <div className="mb-6">
                    <label
                        htmlFor="branch"
                        className="block text-gray-700 font-medium mb-2"
                    >
                        From Branch
                    </label>
                    <select
                        id="branch"
                        value={selectedBranch}
                        onChange={(e) => setSelectedBranch(e.target.value)}
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
                            <option disabled>Media unavailable at the moment.</option>
                        )}
                    </select>
                </div>
                {error && (
                    <div className="mt-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                        <strong>Error:</strong> {error}
                    </div>
                )}
                <button
                    disabled={!selectedBranch}
                    type="submit"
                    className={`w-full p-3 rounded-md transition focus:outline-none focus:ring-2 ${
                        !selectedBranch
                            ? 'bg-gray-400 text-gray-800 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                    }`}
                >
                    Borrow Media
                </button>
            </form>

            {dialogData && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
                        <h2 className="text-xl font-semibold mb-4">Borrow Details</h2>
                        <table className="w-full text-sm text-gray-700">
                            <tbody>
                                <tr>
                                    <td className="font-medium pr-2 align-top whitespace-nowrap">
                                        Pickup:
                                    </td>
                                    <td className="break-words">
                                        {dialogData.pickup}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="font-medium pr-2 align-top whitespace-nowrap">
                                        Author:
                                    </td>
                                    <td className="break-words">
                                        {dialogData.author}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="font-medium pr-2 align-top whitespace-nowrap">
                                        Title:
                                    </td>
                                    <td className="break-words">
                                        {dialogData.title}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="font-medium pr-2 align-top whitespace-nowrap">
                                        Borrow Date:
                                    </td>
                                    <td className="break-words">
                                        {dialogData.borrowDate}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="font-medium pr-2 align-top whitespace-nowrap">
                                        Due Date:
                                    </td>
                                    <td className="break-words">
                                        {dialogData.dueDate}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="font-medium pr-2 align-top whitespace-nowrap">
                                        Renewals:
                                    </td>
                                    <td className="break-words">
                                        {dialogData.renewal_count}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <button
                            onClick={handleDialogConfirm}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            )}


        </div>
    );
};

export default BorrowMedia;
