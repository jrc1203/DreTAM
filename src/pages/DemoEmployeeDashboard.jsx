import React, { useState } from 'react';
import DemoNavbar from '../components/DemoNavbar';
import ExportMenu from '../components/ExportMenu';
import Toast from '../components/Toast';
import { mockClaims } from '../data/mockData';
import { formatDate, formatCurrency } from '../utils/formatters';

const DemoEmployeeDashboard = () => {
    // Filter for only "Raj Kumar" claims to simulate employee view
    const [claims] = useState(mockClaims.filter(c => c.employeeName === 'Raj Kumar'));
    const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'pending', 'approved'
    const [showForm, setShowForm] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
    const [formData, setFormData] = useState({ date: '', description: '', amount: '' });

    const showToast = (message, type = 'info') => {
        setToast({ show: true, message, type });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        showToast('🎭 Demo Mode: Claim submitted successfully! (Data not saved)', 'info');
        setShowForm(false);
        setFormData({ date: '', description: '', amount: '' });
    };

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const filteredClaims = claims.filter(claim => {
        if (statusFilter !== 'all' && claim.status.toLowerCase() !== statusFilter) return false;
        return true;
    });

    const totalClaimed = claims.reduce((sum, c) => sum + c.amount, 0);
    const pendingAmount = claims.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.amount, 0);
    const approvedAmount = claims.filter(c => c.status === 'approved').reduce((sum, c) => sum + c.amount, 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
            <DemoNavbar userRole="Demo Employee" />

            {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ show: false, message: '', type: 'info' })} />}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-2">Employee Dashboard</h1>
                    <p className="text-gray-600 dark:text-gray-300">Submit and track your expense claims</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <button
                        onClick={() => setStatusFilter('all')}
                        className={`stat-card stat-card-border-purple flex items-center justify-between cursor-pointer transition-all duration-300 ${statusFilter === 'all' ? '!bg-purple-100 dark:!bg-purple-900/40 border-purple-500 scale-105 shadow-lg' : 'hover:scale-105'}`}
                    >
                        <div>
                            <h3 className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Total Claimed</h3>
                            <div className="mt-2">
                                <p className="text-3xl font-bold text-gray-800 dark:text-white">{formatCurrency(totalClaimed)}</p>
                                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">{claims.length} claims total</p>
                            </div>
                        </div>
                        <div className="icon-circle icon-circle-blue">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                                <p className="text-3xl font-bold text-gray-800 dark:text-white">{formatCurrency(pendingAmount)}</p>
                                <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Awaiting approval</p>
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
                                <p className="text-3xl font-bold text-gray-800 dark:text-white">{formatCurrency(approvedAmount)}</p>
                                <p className="text-sm font-medium text-green-600 dark:text-green-400">Claims processed</p>
                            </div>
                        </div>
                        <div className="icon-circle icon-circle-green">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </button>
                </div>

                {/* New Claim Button */}
                <div className="mb-6 flex justify-between items-center">
                    <ExportMenu data={filteredClaims} reportTitle="Demo Employee Claims" />
                    <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        New Claim
                    </button>
                </div>

                {/* New Claim Modal */}
                {showForm && (
                    <div className="fixed inset-0 bg-black/20 backdrop-blur-2xl flex items-center justify-center p-4 z-50 transition-all duration-300" onClick={() => setShowForm(false)}>
                        <div className="glass rounded-2xl border border-white/10 shadow-2xl w-full max-w-md p-8 relative animate-fade-in overflow-hidden" onClick={(e) => e.stopPropagation()}>
                            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-all" aria-label="Close modal">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">New Claim Request</h3>

                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">Date <span className="text-pink-500">*</span></label>
                                    <input type="date" value={formData.date} onChange={(e) => handleChange('date', e.target.value)} className="input-field" required />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">Description <span className="text-pink-500">*</span></label>
                                    <input type="text" value={formData.description} onChange={(e) => handleChange('description', e.target.value)} placeholder="e.g. Client Dinner" className="input-field" required />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">Amount (₹) <span className="text-pink-500">*</span></label>
                                    <input type="number" value={formData.amount} onChange={(e) => handleChange('amount', e.target.value)} placeholder="0.00" className="input-field" required />
                                </div>

                                <div className="flex justify-end gap-3 mt-4">
                                    <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 rounded-lg border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-200">
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn-primary flex items-center justify-center min-w-[140px]">
                                        Submit Claim
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Claims Table */}
                <div className="glass rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-purple-50 dark:bg-purple-900/20">
                                <tr>
                                    <th className="table-header text-left">Date</th>
                                    <th className="table-header text-left">Description</th>
                                    <th className="table-header text-right">Amount</th>
                                    <th className="table-header text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredClaims.map((claim) => (
                                    <tr key={claim.id} className="border-b border-gray-200 dark:border-white/10 hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{formatDate(claim.date)}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">{claim.description}</td>
                                        <td className="px-6 py-4 text-right font-semibold text-gray-900 dark:text-white">{formatCurrency(claim.amount)}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`badge ${claim.status === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200' : claim.status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200'}`}>
                                                {claim.status}
                                            </span>
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

export default DemoEmployeeDashboard;
