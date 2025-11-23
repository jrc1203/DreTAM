import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
    const user = auth.currentUser;
    const { theme, setTheme } = useTheme();
    const [showProfileMenu, setShowProfileMenu] = useState(false);

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

    const getThemeIcon = () => {
        if (theme === 'light') return '☀️';
        if (theme === 'dark') return '🌙';
        return '💻';
    };

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center transition-colors duration-300">
            <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">DreTAM</h1>
                {user && (
                    <div className="flex items-center gap-2 ml-4 border-l pl-4 border-gray-300 dark:border-gray-600">
                        {user.photoURL ? (
                            <img
                                src={user.photoURL}
                                alt={user.displayName}
                                className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-600"
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold">
                                {user.displayName ? user.displayName.charAt(0) : 'U'}
                            </div>
                        )}
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{user.displayName}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{user.email}</span>
                        </div>
                    </div>
                )}
            </div>
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title={`Current theme: ${theme}`}
                >
                    {getThemeIcon()}
                </button>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition duration-300"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
