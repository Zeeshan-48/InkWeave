import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import blogReducer from './blogSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        blogs: blogReducer,
    },
    // Adding middleware configuration to prevent serialization warning issues for custom structures if any
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store;
