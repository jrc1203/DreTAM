import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from './firebase';
import Login from './pages/Login';
import EmployeeDashboard from './pages/EmployeeDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import UserManagement from './pages/UserManagement';
import DemoAdminDashboard from './pages/DemoAdminDashboard';
import DemoManagerDashboard from './pages/DemoManagerDashboard';
import DemoEmployeeDashboard from './pages/DemoEmployeeDashboard';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                // Check if user is Admin
                if (currentUser.email === import.meta.env.VITE_ADMIN_EMAIL) {
                    setAuthorized(true);
                    setUser(currentUser);
                } else {
                    // Check if user is in 'users' collection
                    const q = query(collection(db, 'users'), where('email', '==', currentUser.email));
                    const querySnapshot = await getDocs(q);

                    if (!querySnapshot.empty) {
                        setAuthorized(true);
                        const userData = querySnapshot.docs[0].data();
                        setUser({ ...currentUser, role: userData.role });
                    } else {
                        setAuthorized(false);
                        await signOut(auth);
                        alert("Access Denied: You are not authorized to access this application.");
                    }
                }
            } else {
                setUser(null);
                setAuthorized(false);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-screen dark:bg-gray-900"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
    }

    return (
        <ThemeProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
                    <Route
                        path="/"
                        element={
                            user && authorized ? (
                                <Layout>
                                    {user.email === import.meta.env.VITE_ADMIN_EMAIL ? (
                                        <AdminDashboard />
                                    ) : user.role === 'manager' ? (
                                        <ManagerDashboard />
                                    ) : (
                                        <EmployeeDashboard />
                                    )}
                                </Layout>
                            ) : (
                                <Navigate to="/login" />
                            )
                        }
                    />
                    <Route
                        path="/users"
                        element={
                            user && authorized && user.email === import.meta.env.VITE_ADMIN_EMAIL ? (
                                <Layout>
                                    <UserManagement />
                                </Layout>
                            ) : (
                                <Navigate to="/" />
                            )
                        }
                    />
                    {/* Demo Routes - No authentication required */}
                    <Route path="/demo/admin" element={<DemoAdminDashboard />} />
                    <Route path="/demo/manager" element={<DemoManagerDashboard />} />
                    <Route path="/demo/employee" element={<DemoEmployeeDashboard />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
