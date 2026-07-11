import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import authService from '../appwrite/auth';
import { login, logout } from '../redux/authSlice';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const { status, userData, isAdmin } = useSelector((state) => state.auth);

    useEffect(() => {
        const checkUserSession = async () => {
            try {
                const user = await authService.getCurrentUser();
                if (user) {
                    dispatch(login(user));
                } else {
                    dispatch(logout());
                }
            } catch (error) {
                console.error("AuthContext :: Error verifying user session", error);
                dispatch(logout());
            } finally {
                setLoading(false);
            }
        };

        checkUserSession();
    }, [dispatch]);

    return (
        <AuthContext.Provider value={{ loading, status, userData, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);
