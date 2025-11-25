import React from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            // Navigation will be handled by the onAuthStateChanged listener in App.jsx
        } catch (error) {
            console.error("Error logging in: ", error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-500 relative overflow-hidden">

            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
                <div className="blob blob-3"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-24">

                    {/* Left Side: Hero Text */}
                    <div className="text-center md:text-left max-w-lg">
                        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight text-gray-900 dark:text-white">
                            Manage <br />
                            <span className="text-gradient">
                                Travel Claims
                            </span>
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                            Experience the future of corporate expense management.
                            Fast, secure, and beautifully designed for the modern workforce.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            <button
                                onClick={handleLogin}
                                className="btn-primary flex items-center justify-center gap-3 px-8 py-4 text-lg group"
                            >
                                <svg className="w-6 h-6" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                <span>Sign in with Google</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Right Side: Abstract Visual Card */}
                    <div className="relative hidden md:block">
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#6C63FF] to-[#ec4899] rounded-2xl blur opacity-30 animate-pulse"></div>
                        <div className="glass p-8 rounded-2xl shadow-2xl max-w-sm w-full border border-white/20 dark:border-white/10 relative transform rotate-3 hover:rotate-0 transition-all duration-500">

                            {/* Mock UI Elements */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="h-3 w-24 bg-gray-200 dark:bg-white/20 rounded-full"></div>
                                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500"></div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="h-24 rounded-xl bg-gradient-to-r from-[#6C63FF]/10 to-[#ec4899]/10 border border-purple-500/20 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-[#6C63FF]">₹12,450</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-2 w-full bg-gray-100 dark:bg-white/10 rounded-full"></div>
                                    <div className="h-2 w-3/4 bg-gray-100 dark:bg-white/10 rounded-full"></div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <div className="h-2 w-2 rounded-full bg-green-400"></div>
                                <div className="h-2 w-2 rounded-full bg-yellow-400"></div>
                                <div className="h-2 w-2 rounded-full bg-red-400"></div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Login;
