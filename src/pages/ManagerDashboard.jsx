import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import ExportMenu from '../components/ExportMenu';
import FilterDropdown from '../components/FilterDropdown';
import Navbar from '../components/Navbar';
import { formatDate, formatCurrency } from '../utils/formatters';

const ManagerDashboard = () => {
    const [claims, setClaims] = useState([]);
    const [users, setUsers] = useState([]);
    const [filters, setFilters] = useState({ employee: '', date: '' });
    const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'pending', 'approved'
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fetch Claims
        const q = query(collection(db, 'claims'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const claimsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            // Sort by Claim Date (descending)
            claimsData.sort((a, b) => new Date(b.date) - new Date(a.date));
            setClaims(claimsData);
            setIsLoading(false);
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

    // Base filter (Employee & Date only) - used for Stats
    const baseFilteredClaims = claims.filter(claim => {
        const matchesEmployee = filters.employee ? claim.email === filters.employee : true;
        const matchesDate = filters.date ? claim.date === filters.date : true;
        return matchesEmployee && matchesDate;
    });

    // Final filter (Base + Status) - used for Table
    const filteredClaims = baseFilteredClaims.filter(claim => {
        return statusFilter === 'all' ? true : claim.status.toLowerCase() === statusFilter;
    });

    // Calculate Stats from Base Filter (Persistent)
    const pendingClaims = baseFilteredClaims.filter(c => c.status === 'Pending');
    const totalPendingCount = pendingClaims.length;
    const totalPendingAmount = pendingClaims.reduce((sum, c) => sum + Number(c.amount), 0);

    const approvedClaims = baseFilteredClaims.filter(c => c.status === 'Approved');
    const totalApprovedCount = approvedClaims.length;
    const totalApprovedAmount = approvedClaims.reduce((sum, c) => sum + Number(c.amount), 0);

    const rejectedClaims = baseFilteredClaims.filter(c => c.status === 'Rejected');
    const totalRejectedCount = rejectedClaims.length;
    const totalRejectedAmount = rejectedClaims.reduce((sum, c) => sum + Number(c.amount), 0);

    const totalAmount = baseFilteredClaims.reduce((sum, c) => sum + Number(c.amount), 0);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6C63FF]"></div>
            </div>
        );
    }

    return (
        <div className="transition-colors duration-300">
            <Navbar userRole="manager" />
            <div className="container mx-auto px-4 py-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">All Claims</h1>
                        <p className="text-gray-500 dark:text-gray-400">Manager View</p>
                    </div>
                </div>

                {/* Stats Cards - 4 columns */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                    <button
                        onClick={() => setStatusFilter('all')}
                        className={`stat-card stat-card-border-purple flex items-center justify-between cursor-pointer transition-all duration-300 ${statusFilter === 'all' ? '!bg-purple-100 dark:!bg-purple-900/40 border-purple-500 scale-105 shadow-lg' : 'hover:scale-105'}`}
                    >
                        <div>
                            <h3 className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">All Claims</h3>
                            <div className="mt-2">
                                <p className="text-3xl font-bold text-gray-800 dark:text-white">{formatCurrency(totalAmount)}</p>
                                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">{baseFilteredClaims.length} claims total</p>
                            </div>
                        </div>
                        <div className="icon-circle icon-circle-blue">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                    </button>

                    <button
                        onClick={() => setStatusFilter('pending')}
                        className={`stat-card stat-card-border-yellow flex items-center justify-between cursor-pointer transition-all duration-300 ${statusFilter === 'pending' ? '!bg-yellow-100 dark:!bg-yellow-900/40 border-yellow-500 scale-105 shadow-lg' : 'hover:scale-105'}`}
                    >
                        <div>
                            <h3 className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Pending Approval</h3>
                            <div className="mt-2">
                                <p className="text-3xl font-bold text-gray-800 dark:text-white">{formatCurrency(totalPendingAmount)}</p>
                                <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">{totalPendingCount} awaiting approval</p>
                            </div>
                        </div>
                        <div className="icon-circle icon-circle-yellow">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </button>

                    <button
                        onClick={() => setStatusFilter('approved')}
                        className={`stat-card stat-card-border-green flex items-center justify-between cursor-pointer transition-all duration-300 ${statusFilter === 'approved' ? '!bg-green-100 dark:!bg-green-900/40 border-green-500 scale-105 shadow-lg' : 'hover:scale-105'}`}
                    >
                        <div>
                            <h3 className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Total Approved</h3>
                            <div className="mt-2">
                                <p className="text-3xl font-bold text-gray-800 dark:text-white">{formatCurrency(totalApprovedAmount)}</p>
                                <p className="text-sm font-medium text-green-600 dark:text-green-400">{totalApprovedCount} claims processed</p>
                            </div>
                        </div>
                        <div className="icon-circle icon-circle-green">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </button>

                    <button
                        onClick={() => setStatusFilter('rejected')}
                        className={`stat-card stat-card-border-red flex items-center justify-between cursor-pointer transition-all duration-300 ${statusFilter === 'rejected' ? '!bg-red-100 dark:!bg-red-900/40 border-red-500 scale-105 shadow-lg' : 'hover:scale-105'}`}
                    >
                        <div>
                            <h3 className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Total Rejected</h3>
                            <div className="mt-2">
                                <p className="text-3xl font-bold text-gray-800 dark:text-white">{formatCurrency(totalRejectedAmount)}</p>
                                <p className="text-sm font-medium text-red-600 dark:text-red-400">{totalRejectedCount} claims rejected</p>
                            </div>
                        </div>
                        <div className="icon-circle icon-circle-red">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </button>
                </div>

                {/* Filters Section */}
                <div className="flex flex-row flex-wrap justify-between items-center mb-6 gap-3 sm:gap-4 relative z-50">
                    <ExportMenu data={filteredClaims} reportTitle="Manager Claims Report" />

                    <div className="flex flex-row gap-3 sm:gap-4 items-center glass p-3 rounded-lg flex-wrap sm:flex-nowrap">
                        <FilterDropdown
                            options={users.map(user => ({ value: user.email, label: user.name }))}
                            value={filters.employee}
                            onChange={(val) => setFilters({ ...filters, employee: val })}
                            defaultLabel="All Employees"
                            containerClassName=""
                        />

                        <input
                            type="date"
                            value={filters.date}
                            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                            className="px-4 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#6C63FF] bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white"
                        />

                        {(filters.employee || filters.date) && (
                            <button
                                onClick={() => setFilters({ employee: '', date: '' })}
                                className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 px-2"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                {/* Claims Table */}
                <div className="glass rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="table-header">
                                <tr>
                                    <th className="px-6 py-4 text-left table-header-text">Employee</th>
                                    <th className="px-6 py-4 text-left table-header-text">Date</th>
                                    <th className="px-6 py-4 text-left table-header-text">Description</th>
                                    <th className="px-6 py-4 text-left table-header-text">Amount</th>
                                    <th className="px-6 py-4 text-left table-header-text">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-transparent">
                                {filteredClaims.map((claim) => (
                                    <tr key={claim.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900 dark:text-gray-200">{claim.userName}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{claim.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{formatDate(claim.date)}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200">{claim.description}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">{formatCurrency(claim.amount)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`badge ${claim.status === 'Approved' ? 'badge-approved' :
                                                claim.status === 'Rejected' ? 'badge-rejected' :
                                                    'badge-pending'
                                                }`}>
                                                {claim.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {filteredClaims.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                            No claims found
                                        </td>
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
