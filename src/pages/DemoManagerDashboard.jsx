import React, { useState } from 'react';
import DemoNavbar from '../components/DemoNavbar';
import ExportMenu from '../components/ExportMenu';
import FilterDropdown from '../components/FilterDropdown';
import Toast from '../components/Toast';
import { mockUsers, mockClaims } from '../data/mockData';
import { formatDate, formatCurrency } from '../utils/formatters';

const DemoManagerDashboard = () => {
    const [claims] = useState(mockClaims);
    const [users] = useState(mockUsers.filter(u => u.role === 'employee'));
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

    const pendingClaims = claims.filter(c => c.status === 'pending').length;
    const totalAmount = claims.reduce((sum, c) => sum + c.amount, 0);

    const handleAction = (action) => {
        showToast(`🎭 Demo Mode: ${action} action successful! (Data not saved)`, 'info');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
            <DemoNavbar userRole="Demo Manager" />

            {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ show: false, message: '', type: 'info' })} />}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-2">Manager Dashboard</h1>
                    <p className="text-gray-600 dark:text-gray-300">Review and approve team expense claims</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="stat-card stat-card-border-purple flex items-center gap-4">
                        <div className="icon-circle icon-circle-yellow">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Pending Reviews</h3>
                            <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{pendingClaims}</p>
                        </div>
                    </div>

                    <div className="stat-card stat-card-border-green flex items-center gap-4">
                        <div className="icon-circle icon-circle-purple">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Total Amount</h3>
                            <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{formatCurrency(totalAmount)}</p>
                        </div>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 relative z-50">
                    <ExportMenu data={filteredClaims} reportTitle="Demo Manager Claims Report" />

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
                                                    <button onClick={() => handleAction('Approve')} className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded-md transition-colors">
                                                        ✓ Approve
                                                    </button>
                                                    <button onClick={() => handleAction('Reject')} className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded-md transition-colors">
                                                        ✕ Reject
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

export default DemoManagerDashboard;
