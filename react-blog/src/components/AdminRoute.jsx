import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import Loader from './Loader';

const AdminRoute = ({ children }) => {
    const { status, isAdmin, loading } = useAuthContext();

    if (loading) {
        return <Loader fullScreen text="Verifying admin credentials..." />;
    }

    if (!status) {
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminRoute;
