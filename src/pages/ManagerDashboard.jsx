import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import Navbar from '../components/Navbar';
import ExportMenu from '../components/ExportMenu';

const ManagerDashboard = () => {
    const [claims, setClaims] = useState([]);
    const [users, setUsers] = useState([]);
    const [filters, setFilters] = useState({ employee: '', date: '' });

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

        // Fetch Users for filter
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

    // Calculate Stats
    const totalPending = filteredClaims
        .filter(c => c.status === 'Pending')
        .reduce((sum, c) => sum + Number(c.amount), 0);

    const totalApproved = filteredClaims
        .filter(c => c.status === 'Approved')
        .reduce((sum, c) => sum + Number(c.amount), 0);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Navbar />
            <div className="container mx-auto px-4 py-8">

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
                        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase">Pending Approval</h3>
                        <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">₹{totalPending.toLocaleString()}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-green-500">
                        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase">Total Approved</h3>
                        <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">₹{totalApproved.toLocaleString()}</p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">All Claims (Manager View)</h2>
                        <ExportMenu data={filteredClaims} reportTitle="Manager Claims Report" />
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
                                    </tr>
                                ))}
                                {filteredClaims.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">No claims found</td>
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

export default ManagerDashboard;
