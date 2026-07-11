import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    posts: [],
    loading: false,
    error: null,
    searchQuery: '',
    currentPage: 1,
    postsPerPage: 6
};

const blogSlice = createSlice({
    name: 'blogs',
    initialState,
    reducers: {
        setPostsStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        setPostsSuccess: (state, action) => {
            state.posts = action.payload;
            state.loading = false;
        },
        setPostsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        addPost: (state, action) => {
            state.posts.unshift(action.payload);
        },
        updatePostInState: (state, action) => {
            state.posts = state.posts.map(post => 
                post.$id === action.payload.$id ? action.payload : post
            );
        },
        deletePostFromState: (state, action) => {
            state.posts = state.posts.filter(post => post.$id !== action.payload);
        },
        toggleLikePostInState: (state, action) => {
            const { postId, userId } = action.payload;
            const post = state.posts.find(p => p.$id === postId);
            if (post) {
                // Defensive initialization of likes array
                if (!post.likes) post.likes = [];
                
                if (post.likes.includes(userId)) {
                    post.likes = post.likes.filter(id => id !== userId);
                } else {
                    post.likes.push(userId);
                }
            }
        },
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
            state.currentPage = 1; // Reset to page 1 on search
        },
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        }
    }
});

export const {
    setPostsStart,
    setPostsSuccess,
    setPostsFailure,
    addPost,
    updatePostInState,
    deletePostFromState,
    toggleLikePostInState,
    setSearchQuery,
    setCurrentPage
} = blogSlice.actions;

export default blogSlice.reducer;
