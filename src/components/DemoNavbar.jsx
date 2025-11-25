import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const DemoNavbar = ({ userRole = 'Demo User' }) => {
    const { theme, setTheme } = useTheme();
    const navigate = useNavigate();

    const toggleTheme = () => {
        if (theme === 'light') setTheme('dark');
        else if (theme === 'dark') setTheme('system');
        else setTheme('light');
    };

    const handleBackToLogin = () => {
        navigate('/');
    };

    return (
        <nav className="sticky top-6 z-50 flex justify-center px-4 mb-8">
            <div className="glass rounded-full px-6 py-3 flex justify-between items-center transition-all duration-300 shadow-xl w-auto max-w-7xl">
                <div className="flex items-center gap-4 sm:gap-8">
                    <Link to="/" className="text-2xl font-bold tracking-tight flex items-center gap-2 group">
                        <span className="text-gradient group-hover:scale-105 transition-transform duration-300">
                            DreTAM
                        </span>
                    </Link>
                    <span className="px-2 sm:px-3 py-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-bold rounded-full animate-pulse">
                        DEMO
                    </span>
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                    <div className="flex items-center gap-3 pl-2 sm:pl-4 ml-2 sm:ml-6 border-l border-gray-200 dark:border-white/10">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{userRole}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">demo@dretam.com</p>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#ec4899] flex items-center justify-center text-white font-bold shadow-lg text-sm">
                            D
                        </div>
                    </div>

                    <div className="flex items-center gap-1 bg-gray-100/50 dark:bg-black/20 p-1 rounded-full backdrop-blur-sm border border-white/10">
                        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-white dark:hover:bg-white/10 transition-all text-gray-600 dark:text-gray-300" title={`Current theme: ${theme}`}>
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
                        <button onClick={handleBackToLogin} className="p-2 rounded-full hover:bg-blue-50 text-blue-500 hover:text-blue-600 dark:hover:bg-blue-500/10 transition-all" title="Back to Login">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default DemoNavbar;
