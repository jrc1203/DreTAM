import React from 'react';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen relative overflow-hidden transition-colors duration-300 bg-gray-50 dark:bg-[#0f172a] text-gray-800 dark:text-white font-inter">
            {/* Animated Background Blobs */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="blob blob-1 rounded-full mix-blend-multiply dark:mix-blend-screen"></div>
                <div className="blob blob-2 rounded-full mix-blend-multiply dark:mix-blend-screen"></div>
                <div className="blob blob-3 rounded-full mix-blend-multiply dark:mix-blend-screen"></div>
            </div>

            {/* Content Wrapper */}
            <div className="relative z-10 flex flex-col min-h-screen">
                <main className="flex-grow">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
