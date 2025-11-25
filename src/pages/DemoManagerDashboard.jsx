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
    const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'pending', 'approved'
    const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

    const showToast = (message, type = 'info') => {
        setToast({ show: true, message, type });
    };

    // Base filter (Employee & Date only) - used for Stats
    const baseFilteredClaims = claims.filter(claim => {
        if (filters.employee && claim.employeeEmail !== filters.employee) return false;
        if (filters.date && claim.date !== filters.date) return false;
        return true;
    });

    // Final filter (Base + Status) - used for Table
    const filteredClaims = baseFilteredClaims.filter(claim => {
        if (statusFilter !== 'all' && claim.status.toLowerCase() !== statusFilter) return false;
        return true;
    });

    // Calculate stats from base filtered claims
    const totalPending = baseFilteredClaims.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.amount, 0);
    const totalApproved = baseFilteredClaims.filter(c => c.status === 'approved').reduce((sum, c) => sum + c.amount, 0);

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

                {/* Stats Cards - 3 columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <button onClick={() => setStatusFilter('all')} className={`stat-card stat-card-border-purple flex items-center justify-between cursor-pointer transition-all duration-300 ${statusFilter === 'all' ? '!bg-purple-100 dark:!bg-purple-900/40 border-purple-500 scale-105 shadow-lg' : 'hover:scale-105'}`}>
                        <div>
                            <h3 className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">All Claims</h3>
                            <div className="mt-2">
                                <p className="text-3xl font-bold text-gray-800 dark:text-white">{baseFilteredClaims.length}</p>
                                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Total</p>
                            </div>
                        </div>
                        <div className="icon-circle icon-circle-blue">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                    </button>

                    <button onClick={() => setStatusFilter('pending')} className={`stat-card stat-card-border-yellow flex items-center justify-between cursor-pointer transition-all duration-300 ${statusFilter === 'pending' ? '!bg-yellow-100 dark:!bg-yellow-900/40 border-yellow-500 scale-105 shadow-lg' : 'hover:scale-105'}`}>
                        <div>
                            <h3 className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Pending Approval</h3>
                            <div className="mt-2">
                                <p className="text-3xl font-bold text-gray-800 dark:text-white">{formatCurrency(totalPending)}</p>
                                <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Pending Amount</p>
                            </div>
                        </div>
                        <div className="icon-circle icon-circle-yellow">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </button>

                    <button onClick={() => setStatusFilter('approved')} className={`stat-card stat-card-border-green flex items-center justify-between cursor-pointer transition-all duration-300 ${statusFilter === 'approved' ? '!bg-green-100 dark:!bg-green-900/40 border-green-500 scale-105 shadow-lg' : 'hover:scale-105'}`}>
                        <div>
                            <h3 className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Total Approved</h3>
                            <div className="mt-2">
                                <p className="text-3xl font-bold text-gray-800 dark:text-white">{formatCurrency(totalApproved)}</p>
                                <p className="text-sm font-medium text-green-600 dark:text-green-400">Approved Amount</p>
                            </div>
                        </div>
                        <div className="icon-circle icon-circle-green">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </button>
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
