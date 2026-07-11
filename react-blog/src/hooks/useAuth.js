import { useDispatch, useSelector } from 'react-redux';
import authService from '../appwrite/auth';
import { login, logout } from '../redux/authSlice';
import { useState } from 'react';

export const useAuth = () => {
    const dispatch = useDispatch();
    const { status: isAuthenticated, userData: user, isAdmin } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loginUser = async ({ email, password }) => {
        setLoading(true);
        setError(null);
        try {
            await authService.login({ email, password });
            const currentUser = await authService.getCurrentUser();
            if (currentUser) {
                dispatch(login(currentUser));
                return currentUser;
            }
        } catch (err) {
            setError(err?.message || "Login failed. Please verify credentials.");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const signupUser = async ({ email, password, name }) => {
        setLoading(true);
        setError(null);
        try {
            await authService.createAccount({ email, password, name });
            const currentUser = await authService.getCurrentUser();
            if (currentUser) {
                dispatch(login(currentUser));
                return currentUser;
            }
        } catch (err) {
            setError(err?.message || "Sign up failed. Please try again.");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logoutUser = async () => {
        setLoading(true);
        setError(null);
        try {
            await authService.logout();
            dispatch(logout());
        } catch (err) {
            setError(err?.message || "Logout failed.");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        user,
        isAuthenticated,
        isAdmin,
        loading,
        error,
        loginUser,
        signupUser,
        logoutUser
    };
};
