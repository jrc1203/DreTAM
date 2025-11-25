import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useTheme } from '../context/ThemeContext';

const Navbar = ({ userRole }) => {
    const user = auth.currentUser;
    const { theme, setTheme } = useTheme();

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    const toggleTheme = () => {
        if (theme === 'light') setTheme('dark');
        else if (theme === 'dark') setTheme('system');
        else setTheme('light');
    };

    return (
        <nav className="sticky top-6 z-50 flex justify-center px-4 mb-8">
            <div className="glass rounded-full px-6 py-3 flex justify-between items-center transition-all duration-300 shadow-xl w-auto max-w-7xl">

                {/* Logo Section */}
                <div className="flex items-center gap-8">
                    <Link to="/" className="text-2xl font-bold tracking-tight flex items-center gap-2 group">
                        <span className="text-gradient group-hover:scale-105 transition-transform duration-300">
                            DreTAM
                        </span>
                    </Link>

                    {/* Manage Users Navigation */}
                    {user && (userRole === 'admin' || userRole === 'manager') && (
                        <div className="flex items-center">
                            <Link
                                to="/users"
                                className="flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-full text-sm font-medium text-gray-600 hover:text-[#6C63FF] hover:bg-purple-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/5 transition-all"
                                title="Manage Users"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                <span className="hidden md:inline">Manage Users</span>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-4">
                    {user && (
                        <div className="flex items-center gap-3 pl-4 ml-6 border-l border-gray-200 dark:border-white/10">
                            <div className="text-right hidden sm:block">
                                <div className="flex items-center justify-end gap-2 mb-0.5">
                                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{user.displayName}</p>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${userRole === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-200' :
                                        userRole === 'manager' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200' :
                                            'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-200'
                                        }`}>
                                        {userRole}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                            </div>
                            {user.photoURL ? (
                                <img
                                    src={user.photoURL}
                                    alt={user.displayName}
                                    className="w-9 h-9 rounded-full border-2 border-purple-200 dark:border-purple-500/30 shadow-sm"
                                />
                            ) : (
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#ec4899] flex items-center justify-center text-white font-bold shadow-lg text-sm">
                                    {user.displayName ? user.displayName.charAt(0) : 'U'}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex items-center gap-1 bg-gray-100/50 dark:bg-black/20 p-1 rounded-full backdrop-blur-sm border border-white/10">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-white dark:hover:bg-white/10 transition-all text-gray-600 dark:text-gray-300"
                            title={`Current theme: ${theme}`}
                        >
                            {theme === 'light' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            ) : theme === 'dark' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            )}
                        </button>
                        <button
                            onClick={handleLogout}
                            className="p-2 rounded-full hover:bg-red-50 text-red-500 hover:text-red-600 dark:hover:bg-red-500/10 transition-all"
                            title="Logout"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
