import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, orderBy, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import Navbar from '../components/Navbar';
import ExportMenu from '../components/ExportMenu';

const AdminDashboard = () => {
    const [claims, setClaims] = useState([]);
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ email: '', name: '', role: 'employee' });
    const [filters, setFilters] = useState({ employee: '', date: '' });
    const [editingUser, setEditingUser] = useState(null);

    useEffect(() => {
        // Fetch Claims
        const q = query(collection(db, 'claims'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const claimsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setClaims(claimsData);
        });

        // Fetch Users
        const usersQuery = query(collection(db, 'users'));
        const unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
            const usersData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsers(usersData);
        });

        return () => {
            unsubscribe();
            unsubscribeUsers();
        };
    }, []);

    const filteredClaims = claims.filter(claim => {
        const matchesEmployee = filters.employee ? claim.email === filters.employee : true;
        const matchesDate = filters.date ? claim.date === filters.date : true;
        return matchesEmployee && matchesDate;
    });

    const handleStatusUpdate = async (claimId, newStatus) => {
        try {
            const claimRef = doc(db, 'claims', claimId);
            await updateDoc(claimRef, {
                status: newStatus
            });
        } catch (error) {
            console.error("Error updating status: ", error);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        if (!newUser.email || !newUser.name) return;

        try {
            await addDoc(collection(db, 'users'), {
                email: newUser.email,
                name: newUser.name,
                role: newUser.role,
                createdAt: serverTimestamp()
            });
            setNewUser({ email: '', name: '', role: 'employee' });
            alert('User added successfully!');
        } catch (error) {
            console.error("Error adding user: ", error);
            alert('Error adding user');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteDoc(doc(db, 'users', userId));
            } catch (error) {
                console.error("Error deleting user: ", error);
                alert("Failed to delete user");
            }
        }
    };

    const handleUpdateUser = async (user) => {
        try {
            const userRef = doc(db, 'users', user.id);
            await updateDoc(userRef, {
                name: user.name,
                role: user.role
            });
            setEditingUser(null);
        } catch (error) {
            console.error("Error updating user: ", error);
            alert("Failed to update user");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Navbar />
            <div className="container mx-auto px-4 py-8">

                {/* User Management Section */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8 transition-colors duration-300">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Manage Users</h2>
                    <form onSubmit={handleAddUser} className="flex flex-wrap gap-4 items-end mb-6">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                            <input
                                type="text"
                                value={newUser.name}
                                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="Joyrc"
                                required
                            />
                        </div>
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                            <input
                                type="email"
                                value={newUser.email}
                                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="joyrc@example.com"
                                required
                            />
                        </div>
                        <div className="w-40">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                            <select
                                value={newUser.role}
                                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            >
                                <option value="employee">Employee</option>
                                <option value="manager">Manager</option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition duration-300 h-[42px]"
                        >
                            Add User
                        </button>
                    </form>

                    <div className="mt-4">
                        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Authorized Users</h3>
                        <div className="flex flex-col gap-2">
                            {users.map(user => (
                                <div key={user.id} className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg text-sm flex items-center justify-between gap-2">
                                    {editingUser?.id === user.id ? (
                                        <div className="flex items-center gap-2 flex-1">
                                            <input
                                                type="text"
                                                value={editingUser.name}
                                                onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                                className="p-1 border rounded text-xs dark:bg-gray-600 dark:text-white"
                                            />
                                            <select
                                                value={editingUser.role}
                                                onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                                                className="p-1 border rounded text-xs dark:bg-gray-600 dark:text-white"
                                            >
                                                <option value="employee">Employee</option>
                                                <option value="manager">Manager</option>
                                            </select>
                                            <button onClick={() => handleUpdateUser(editingUser)} className="text-green-600 hover:text-green-800 text-xs font-bold">Save</button>
                                            <button onClick={() => setEditingUser(null)} className="text-gray-600 hover:text-gray-800 text-xs">Cancel</button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 flex-1">
                                            <span className="font-medium dark:text-gray-200">{user.name}</span>
                                            <span className="text-gray-500 dark:text-gray-400 text-xs">({user.email})</span>
                                            <span className={`text-xs px-1.5 py-0.5 rounded ${user.role === 'manager' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200' : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'}`}>
                                                {user.role}
                                            </span>
                                        </div>
                                    )}

                                    {!editingUser && (
                                        <div className="flex gap-2">
                                            <button onClick={() => setEditingUser(user)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                </svg>
                                            </button>
                                            <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-800 dark:text-red-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 000-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {users.length === 0 && <span className="text-gray-400 text-sm">No users added yet.</span>}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">All Claims</h2>
                        <ExportMenu data={filteredClaims} reportTitle="Admin Claims Report" />
                    </div>

                    {/* Filters */}
                    <div className="flex gap-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm transition-colors duration-300">
                        <div>
                            <select
                                value={filters.employee}
                                onChange={(e) => setFilters({ ...filters, employee: e.target.value })}
                                className="p-2 border rounded text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            >
                                <option value="">All Employees</option>
                                {users.map(user => (
                                    <option key={user.id} value={user.email}>{user.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <input
                                type="date"
                                value={filters.date}
                                onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                                className="p-2 border rounded text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>
                        {(filters.employee || filters.date) && (
                            <button
                                onClick={() => setFilters({ employee: '', date: '' })}
                                className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden transition-colors duration-300">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Employee</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredClaims.map((claim) => (
                                    <tr key={claim.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900 dark:text-gray-200">{claim.userName}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{claim.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{claim.date}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200">{claim.description}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">₹{claim.amount}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${claim.status === 'Approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                                    claim.status === 'Rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
                                                {claim.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {claim.status === 'Pending' && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleStatusUpdate(claim.id, 'Approved')}
                                                        className="text-green-600 hover:text-green-900 bg-green-50 px-3 py-1 rounded border border-green-200 hover:bg-green-100 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/40"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(claim.id, 'Rejected')}
                                                        className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded border border-red-200 hover:bg-red-100 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/40"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {filteredClaims.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">No claims found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
