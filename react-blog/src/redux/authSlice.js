import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    status: false,
    userData: null,
    isAdmin: false
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.status = true;
            state.userData = action.payload;
            
            // Determine admin status. For flexible local testing and validation,
            // we will mark the user as admin if their email contains 'admin'
            // or if they have a specific admin email (e.g. admin@gmail.com).
            const email = action.payload?.email || '';
            state.isAdmin = email.toLowerCase().includes('admin') || email === 'admin@blog.com';
        },
        logout: (state) => {
            state.status = false;
            state.userData = null;
            state.isAdmin = false;
        }
    }
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
