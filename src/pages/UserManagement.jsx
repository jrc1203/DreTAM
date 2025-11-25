import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, doc, updateDoc, addDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ email: '', name: '', role: 'employee' });
    const [editingUser, setEditingUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Validation & UI State
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const validateField = (name, value) => {
        let error = '';
        if (name === 'name') {
            if (!value.trim()) error = 'Name is required';
        } else if (name === 'email') {
            if (!value.trim()) {
                error = 'Email is required';
            } else if (!emailRegex.test(value)) {
                error = 'Please enter a valid email address';
            }
        }
        return error;
    };

    const handleChange = (name, value) => {
        setNewUser(prev => ({ ...prev, [name]: value }));
        if (touched[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: validateField(name, value)
            }));
        }
    };

    const handleBlur = (name) => {
        setTouched(prev => ({ ...prev, [name]: true }));
        setErrors(prev => ({
            ...prev,
            [name]: validateField(name, newUser[name])
        }));
    };

    const isFormValid = () => {
        const nameError = validateField('name', newUser.name);
        const emailError = validateField('email', newUser.email);
        return !nameError && !emailError && newUser.name && newUser.email;
    };

    // Close modal on ESC key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isModalOpen) {
                setIsModalOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isModalOpen]);

    // Reset state when modal opens/closes
    useEffect(() => {
        if (!isModalOpen) {
            setNewUser({ email: '', name: '', role: 'employee' });
            setErrors({});
            setTouched({});
            setSuccessMessage('');
            setErrorMessage('');
            setIsLoading(false);
        }
    }, [isModalOpen]);

    useEffect(() => {
        const usersQuery = query(collection(db, 'users'));
        const unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
            const usersData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsers(usersData);
        });

        return () => unsubscribeUsers();
    }, []);

    const handleAddUser = async (e) => {
        e.preventDefault();

        // Validate all fields
        const nameError = validateField('name', newUser.name);
        const emailError = validateField('email', newUser.email);

        setErrors({
            name: nameError,
            email: emailError
        });
        setTouched({
            name: true,
            email: true
        });

        if (nameError || emailError) return;

        if (nameError || emailError) return;

        setIsLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            // Check for duplicate email (optional but good practice)
            // For now, just add to Firestore
            await addDoc(collection(db, 'users'), {
                email: newUser.email,
                name: newUser.name,
                role: newUser.role,
                createdAt: serverTimestamp()
            });

            setSuccessMessage('User added successfully!');

            // Close modal after short delay to show success message
            setTimeout(() => {
                setIsModalOpen(false);
                setSuccessMessage('');
            }, 1500);

        } catch (error) {
            console.error("Error adding user: ", error);
            setErrorMessage('Error adding user: ' + error.message);
        } finally {
            setIsLoading(false);
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
        <div className="transition-colors duration-300">
            <div className="container mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">User Management</h1>
                        <p className="text-gray-500 dark:text-gray-400">Manage authorized users and roles</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Add New User
                    </button>
                </div>

                <div className="glass rounded-2xl p-6 mb-8 transition-colors duration-300">

                    {/* Modal */}
                    {isModalOpen && (
                        <div
                            className="fixed inset-0 bg-black/20 backdrop-blur-2xl flex items-center justify-center z-50 p-4 transition-all duration-300"
                            onClick={() => setIsModalOpen(false)}
                        >
                            <div
                                className="glass rounded-2xl border border-white/10 shadow-2xl w-full max-w-md p-8 relative animate-fade-in overflow-hidden"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-all"
                                    aria-label="Close modal"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>

                                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Add New User</h3>

                                {successMessage && (
                                    <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-700 dark:text-green-300 text-sm flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        {successMessage}
                                    </div>
                                )}

                                {errorMessage && (
                                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-700 dark:text-red-300 text-sm flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {errorMessage}
                                    </div>
                                )}

                                <form onSubmit={handleAddUser} className="flex flex-col">
                                    <div className="mb-6">
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">
                                            Name <span className="text-pink-500">*</span>
                                        </label>
                                        <input
                                            id="name"
                                            type="text"
                                            value={newUser.name}
                                            onChange={(e) => handleChange('name', e.target.value)}
                                            onBlur={() => handleBlur('name')}
                                            className={`input-field ${errors.name && touched.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                                            placeholder="Joyrc"
                                            disabled={isLoading}
                                        />
                                        {errors.name && touched.name && (
                                            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                                        )}
                                    </div>

                                    <div className="mb-6">
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">
                                            Email <span className="text-pink-500">*</span>
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            value={newUser.email}
                                            onChange={(e) => handleChange('email', e.target.value)}
                                            onBlur={() => handleBlur('email')}
                                            className={`input-field ${errors.email && touched.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                                            placeholder="Joyrc@example.com"
                                            disabled={isLoading}
                                        />
                                        {errors.email && touched.email && (
                                            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                        )}
                                    </div>

                                    <div className="mb-8">
                                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">
                                            Role
                                        </label>
                                        <select
                                            id="role"
                                            value={newUser.role}
                                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                            className="input-field cursor-pointer"
                                            disabled={isLoading}
                                        >
                                            <option value="employee">Employee</option>
                                            <option value="manager">Manager</option>
                                        </select>
                                    </div>

                                    <div className="flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
                                            className="px-6 py-2.5 rounded-lg border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-200"
                                            disabled={isLoading}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn-primary flex items-center justify-center min-w-[120px]"
                                            disabled={!isFormValid() || isLoading}
                                        >
                                            {isLoading ? (
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            ) : (
                                                'Save User'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Users List */}
                    <div>
                        <div className="flex flex-col gap-3">
                            {users.map(user => (
                                <div key={user.id} className="bg-white/50 dark:bg-white/5 px-6 py-4 rounded-lg flex items-center justify-between gap-4 border border-white/10 hover:bg-white/70 dark:hover:bg-white/10 transition-colors">
                                    {editingUser?.id === user.id ? (
                                        <div className="flex items-center gap-4 flex-1">
                                            <input
                                                type="text"
                                                value={editingUser.name}
                                                onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                                className="p-2 border rounded text-sm flex-1 dark:bg-gray-600 dark:text-white"
                                            />
                                            <select
                                                value={editingUser.role}
                                                onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                                                className="p-2 border rounded text-sm w-32 dark:bg-gray-600 dark:text-white"
                                            >
                                                <option value="employee">Employee</option>
                                                <option value="manager">Manager</option>
                                            </select>
                                            <button onClick={() => handleUpdateUser(editingUser)} className="btn-success">Save</button>
                                            <button onClick={() => setEditingUser(null)} className="btn-secondary px-4 py-2">Cancel</button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex items-center gap-4 flex-1">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-gray-800 dark:text-white text-base">{user.name}</span>
                                                    <span className="text-gray-500 dark:text-gray-400">{user.email}</span>
                                                </div>
                                                <span className={`badge ${user.role === 'manager' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200' : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'}`}>
                                                    {user.role}
                                                </span>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => setEditingUser(user)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors" title="Edit">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                    </svg>
                                                </button>
                                                <button onClick={() => handleDeleteUser(user.id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors" title="Delete">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 000-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                            {users.length === 0 && <span className="text-gray-500 dark:text-gray-400 text-center py-8">No users added yet.</span>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
