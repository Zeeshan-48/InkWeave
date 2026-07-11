import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import Pages
import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Profile from '../pages/Profile';
import CreateBlog from '../pages/CreateBlog';
import EditBlog from '../pages/EditBlog';
import BlogDetails from '../pages/BlogDetails';
import Dashboard from '../pages/Dashboard';
import AdminDashboard from '../pages/AdminDashboard';

// Import Guards
import ProtectedRoute from '../components/ProtectedRoute';
import AdminRoute from '../components/AdminRoute';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/blog/:id" element={<BlogDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes (Authenticated Authors) */}
            <Route 
                path="/dashboard" 
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/profile" 
                element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/create-blog" 
                element={
                    <ProtectedRoute>
                        <CreateBlog />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/edit-blog/:id" 
                element={
                    <ProtectedRoute>
                        <EditBlog />
                    </ProtectedRoute>
                } 
            />

            {/* Admin Routes */}
            <Route 
                path="/admin" 
                element={
                    <AdminRoute>
                        <AdminDashboard />
                    </AdminRoute>
                } 
            />

            {/* Fallback Catch-all Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;
