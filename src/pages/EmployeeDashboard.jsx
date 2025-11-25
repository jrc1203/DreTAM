import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, where, onSnapshot, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import ExportMenu from '../components/ExportMenu';
import Toast from '../components/Toast';
import { formatDate, formatCurrency } from '../utils/formatters';

const EmployeeDashboard = () => {
    const [claims, setClaims] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        date: '',
        description: '',
        amount: ''
    });
    const [filterDate, setFilterDate] = useState('');

    // UI States
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState({ message: '', type: '', visible: false });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const showToast = (message, type = 'success') => {
        setToast({ message, type, visible: true });
    };

    const hideToast = () => {
        setToast({ ...toast, visible: false });
    };

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        const q = query(
            collection(db, 'claims'),
            where('uid', '==', user.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const claimsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            // Client-side sort by Claim Date
            claimsData.sort((a, b) => new Date(b.date) - new Date(a.date));
            setClaims(claimsData);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Reset form state when modal closes
    useEffect(() => {
        if (!showForm) {
            setFormData({ date: '', description: '', amount: '' });
            setErrors({});
            setTouched({});
        }
    }, [showForm]);

    const validateField = (name, value) => {
        if (!value) return 'This field is required';
        if (name === 'amount' && Number(value) <= 0) return 'Amount must be greater than 0';
        return '';
    };

    const handleBlur = (name) => {
        setTouched(prev => ({ ...prev, [name]: true }));
        setErrors(prev => ({
            ...prev,
            [name]: validateField(name, formData[name])
        }));
    };

    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        if (touched[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: validateField(name, value)
            }));
        }
    };

    const isFormValid = () => {
        const dateError = validateField('date', formData.date);
        const descError = validateField('description', formData.description);
        const amountError = validateField('amount', formData.amount);
        return !dateError && !descError && !amountError && formData.date && formData.description && formData.amount;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dateError = validateField('date', formData.date);
        const descError = validateField('description', formData.description);
        const amountError = validateField('amount', formData.amount);

        setErrors({
            date: dateError,
            description: descError,
            amount: amountError
        });
        setTouched({
            date: true,
            description: true,
            amount: true
        });

        if (dateError || descError || amountError) return;

        setIsSubmitting(true);

        try {
            await addDoc(collection(db, 'claims'), {
                uid: auth.currentUser.uid,
                userName: auth.currentUser.displayName,
                email: auth.currentUser.email,
                date: formData.date,
                description: formData.description,
                amount: Number(formData.amount),
                status: 'Pending',
                createdAt: serverTimestamp()
            });
            setShowForm(false);
            showToast('Claim submitted successfully!', 'success');
        } catch (error) {
            console.error("Error adding claim: ", error);
            showToast('Failed to submit claim. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (claimId) => {
        if (window.confirm('Are you sure you want to delete this claim?')) {
            try {
                await deleteDoc(doc(db, 'claims', claimId));
                showToast('Claim deleted successfully', 'success');
            } catch (error) {
                console.error("Error deleting claim: ", error);
                showToast('Failed to delete claim', 'error');
            }
        }
    };

    const filteredClaims = claims.filter(claim => {
        return filterDate ? claim.date === filterDate : true;
    });

    const totalPending = filteredClaims
        .filter(c => c.status === 'Pending')
        .reduce((sum, c) => sum + Number(c.amount), 0);

    const totalApproved = filteredClaims
        .filter(c => c.status === 'Approved')
        .reduce((sum, c) => sum + Number(c.amount), 0);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6C63FF]"></div>
            </div>
        );
    }

    return (
        <div className="transition-colors duration-300 relative">
            {toast.visible && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={hideToast}
                />
            )}

            <div className="container mx-auto px-4 py-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">My Travel Claims</h1>
                        <p className="text-gray-500 dark:text-gray-400">Track and manage your expenses</p>
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New Claim
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="stat-card stat-card-border-yellow flex items-center justify-between">
                        <div>
                            <h3 className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Pending Approval</h3>
                            <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">{formatCurrency(totalPending)}</p>
                        </div>
                        <div className="icon-circle icon-circle-yellow">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    <div className="stat-card stat-card-border-green flex items-center justify-between">
                        <div>
                            <h3 className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Total Approved</h3>
                            <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">{formatCurrency(totalApproved)}</p>
                        </div>
                        <div className="icon-circle icon-circle-green">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <ExportMenu data={filteredClaims} reportTitle="My Claims Report" />

                    <div className="flex gap-4 glass p-3 rounded-lg w-full md:w-auto">
                        <input
                            type="date"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            className="px-4 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#6C63FF] bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white"
                        />
                        {filterDate && (
                            <button
                                onClick={() => setFilterDate('')}
                                className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 px-2"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                {showForm && (
                    <div
                        className="fixed inset-0 bg-black/20 backdrop-blur-2xl flex items-center justify-center p-4 z-50 transition-all duration-300"
                        onClick={() => setShowForm(false)}
                    >
                        <div
                            className="glass rounded-2xl border border-white/10 shadow-2xl w-full max-w-md p-8 relative animate-fade-in overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setShowForm(false)}
                                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-all"
                                aria-label="Close modal"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">New Claim Request</h3>

                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">
                                        Date <span className="text-pink-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => handleChange('date', e.target.value)}
                                        onBlur={() => handleBlur('date')}
                                        className={`input-field ${errors.date && touched.date ? 'border-red-500 focus:ring-red-500' : ''}`}
                                        disabled={isSubmitting}
                                    />
                                    {errors.date && touched.date && (
                                        <p className="text-red-500 text-xs mt-1">{errors.date}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">
                                        Description <span className="text-pink-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.description}
                                        onChange={(e) => handleChange('description', e.target.value)}
                                        onBlur={() => handleBlur('description')}
                                        placeholder="e.g. Client Dinner"
                                        className={`input-field ${errors.description && touched.description ? 'border-red-500 focus:ring-red-500' : ''}`}
                                        disabled={isSubmitting}
                                    />
                                    {errors.description && touched.description && (
                                        <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">
                                        Amount (₹) <span className="text-pink-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.amount}
                                        onChange={(e) => handleChange('amount', e.target.value)}
                                        onBlur={() => handleBlur('amount')}
                                        placeholder="0.00"
                                        className={`input-field ${errors.amount && touched.amount ? 'border-red-500 focus:ring-red-500' : ''}`}
                                        disabled={isSubmitting}
                                    />
                                    {errors.amount && touched.amount && (
                                        <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
                                    )}
                                </div>

                                <div className="flex justify-end gap-3 mt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="px-6 py-2.5 rounded-lg border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-200"
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-primary flex items-center justify-center min-w-[140px]"
                                        disabled={!isFormValid() || isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : (
                                            'Submit Claim'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="glass rounded-2xl overflow-hidden transition-colors duration-300">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="table-header">
                                <tr>
                                    <th className="px-6 py-4 text-left table-header-text">Date</th>
                                    <th className="px-6 py-4 text-left table-header-text">Description</th>
                                    <th className="px-6 py-4 text-left table-header-text">Amount</th>
                                    <th className="px-6 py-4 text-left table-header-text">Status</th>
                                    <th className="px-6 py-4 text-left table-header-text">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-transparent">
                                {filteredClaims.map((claim) => (
                                    <tr key={claim.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
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
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {claim.status === 'Pending' && (
                                                <button
                                                    onClick={() => handleDelete(claim.id)}
                                                    className="btn-danger"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {filteredClaims.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">No claims found</td>
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

export default EmployeeDashboard;
