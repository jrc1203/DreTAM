import React, { useState } from 'react';
import DemoNavbar from '../components/DemoNavbar';
import ExportMenu from '../components/ExportMenu';
import FilterDropdown from '../components/FilterDropdown';
import Toast from '../components/Toast';
import { mockUsers, mockClaims } from '../data/mockData';
import { formatDate, formatCurrency } from '../utils/formatters';

const DemoAdminDashboard = () => {
    const [claims] = useState(mockClaims);
    const [users] = useState(mockUsers);
    const [filters, setFilters] = useState({ employee: '', date: '' });
    const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

    const showToast = (message, type = 'info') => {
        setToast({ show: true, message, type });
    };

    const filteredClaims = claims.filter(claim => {
        if (filters.employee && claim.employeeEmail !== filters.employee) return false;
        if (filters.date && claim.date !== filters.date) return false;
        return true;
    });

    const totalClaims = claims.length;
    const pendingClaims = claims.filter(c => c.status === 'pending').length;
    const approvedClaims = claims.filter(c => c.status === 'approved').length;
    const rejectedClaims = claims.filter(c => c.status === 'rejected').length;
    const totalUsers = users.length;
    const totalAmountPending = claims.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.amount, 0);

    const handleStatusChange = (action) => {
        showToast(`🎭 Demo Mode: ${action} action successful! (Data not saved)`, 'info');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
            <DemoNavbar userRole="Demo Admin" />

            {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ show: false, message: '', type: 'info' })} />}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-2">Admin Dashboard</h1>
                    <p className="text-gray-600 dark:text-gray-300">Manage claims, users, and oversee all activities</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="stat-card stat-card-border-purple flex flex-col">
                        <div className="icon-circle icon-circle-blue mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                        </div>
                        <h3 className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Total Claims</h3>
                        <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{totalClaims}</p>
                    </div>

                    <div className="stat-card stat-card-border-yellow flex flex-col">
                        <div className="icon-circle icon-circle-yellow mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Pending</h3>
                        <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{pendingClaims}</p>
                    </div>

                    <div className="stat-card stat-card-border-green flex flex-col">
                        <div className="icon-circle icon-circle-green mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Approved</h3>
                        <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{approvedClaims}</p>
                    </div>

                    <div className="stat-card stat-card-border-red flex flex-col">
                        <div className="icon-circle icon-circle-red mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Rejected</h3>
                        <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{rejectedClaims}</p>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 relative z-50">
                    <ExportMenu data={filteredClaims} reportTitle="Demo Admin Claims Report" />

                    <div className="flex flex-col sm:flex-row gap-4 items-center glass p-3 rounded-lg">
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
                        <table className="w-full">
                            <thead className="bg-purple-50 dark:bg-purple-900/20">
                                <tr>
                                    <th className="table-header text-left">Employee</th>
                                    <th className="table-header text-left">Date</th>
                                    <th className="table-header text-left">Description</th>
                                    <th className="table-header text-right">Amount</th>
                                    <th className="table-header text-center">Status</th>
                                    <th className="table-header text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredClaims.map((claim) => (
                                    <tr key={claim.id} className="border-b border-gray-200 dark:border-white/10 hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-gray-900 dark:text-white">{claim.employeeName}</span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">{claim.employeeEmail}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{formatDate(claim.date)}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">{claim.description}</td>
                                        <td className="px-6 py-4 text-right font-semibold text-gray-900 dark:text-white">{formatCurrency(claim.amount)}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`badge ${claim.status === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200' : claim.status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200'}`}>
                                                {claim.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {claim.status === 'pending' && (
                                                <div className="flex justify-center gap-2">
                                                    <button onClick={() => handleStatusChange('Approve')} className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded-md transition-colors">
                                                        Approve
                                                    </button>
                                                    <button onClick={() => handleStatusChange('Reject')} className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded-md transition-colors">
                                                        Reject
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DemoAdminDashboard;
