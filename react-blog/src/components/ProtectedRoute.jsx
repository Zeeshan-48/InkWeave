import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import Loader from './Loader';

const ProtectedRoute = ({ children }) => {
    const { status, loading } = useAuthContext();

    if (loading) {
        return <Loader fullScreen text="Verifying credentials..." />;
    }

    if (!status) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
