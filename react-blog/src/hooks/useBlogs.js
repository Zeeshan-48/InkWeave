import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import blogService from '../appwrite/database';
import storageService from '../appwrite/storage';
import {
    setPostsStart,
    setPostsSuccess,
    setPostsFailure,
    addPost,
    updatePostInState,
    deletePostFromState,
    toggleLikePostInState
} from '../redux/blogSlice';
import { Query } from 'appwrite';

export const useBlogs = () => {
    const dispatch = useDispatch();
    const { posts, loading, error, searchQuery, currentPage, postsPerPage } = useSelector((state) => state.blogs);
    const { userData } = useSelector((state) => state.auth);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchPosts = useCallback(async () => {
        dispatch(setPostsStart());
        try {
            // Visitors see only active posts
            const res = await blogService.getPosts([Query.equal("status", "active")]);
            dispatch(setPostsSuccess(res.documents || []));
            return res.documents;
        } catch (err) {
            dispatch(setPostsFailure(err?.message || "Failed to load blogs."));
            return [];
        }
    }, [dispatch]);

    const fetchAllPostsAdmin = useCallback(async () => {
        dispatch(setPostsStart());
        try {
            // Admins can see all posts
            const res = await blogService.getAllPosts();
            dispatch(setPostsSuccess(res.documents || []));
            return res.documents;
        } catch (err) {
            dispatch(setPostsFailure(err?.message || "Failed to load blogs."));
            return [];
        }
    }, [dispatch]);

    const fetchUserPosts = useCallback(async (userId) => {
        dispatch(setPostsStart());
        try {
            let res;
            try {
                res = await blogService.getAllPosts([Query.equal("userID", userId)]);
            } catch (err) {
                if (err.message && err.message.includes("Attribute not found")) {
                    res = await blogService.getAllPosts([Query.equal("userId", userId)]);
                } else {
                    throw err;
                }
            }
            dispatch(setPostsSuccess(res.documents || []));
            return res.documents;
        } catch (err) {
            dispatch(setPostsFailure(err?.message || "Failed to load blogs."));
            return [];
        }
    }, [dispatch]);

    const createBlogPost = async ({ title, content, status, imageFile }) => {
        setActionLoading(true);
        try {
            let fileId = '';
            if (imageFile) {
                const uploadedFile = await storageService.uploadFile(imageFile);
                if (uploadedFile) {
                    fileId = uploadedFile.$id;
                }
            }

            const authorName = userData?.name || 'Anonymous';
            const newPost = await blogService.createPost({
                title,
                content,
                featuredImage: fileId,
                status,
                userId: userData.$id,
                author: authorName
            });

            if (newPost) {
                dispatch(addPost(newPost));
            }
            return newPost;
        } catch (err) {
            console.error("useBlogs :: createBlogPost :: error", err);
            throw err;
        } finally {
            setActionLoading(false);
        }
    };

    const updateBlogPost = async (postId, { title, content, status, imageFile, oldImageId }) => {
        setActionLoading(true);
        try {
            let fileId = oldImageId;
            if (imageFile) {
                // upload new image
                const uploadedFile = await storageService.uploadFile(imageFile);
                if (uploadedFile) {
                    fileId = uploadedFile.$id;
                    // delete old image if it exists
                    if (oldImageId) {
                        await storageService.deleteFile(oldImageId);
                    }
                }
            }

            const updatedPost = await blogService.updatePost(postId, {
                title,
                content,
                featuredImage: fileId,
                status
            });

            if (updatedPost) {
                dispatch(updatePostInState(updatedPost));
            }
            return updatedPost;
        } catch (err) {
            console.error("useBlogs :: updateBlogPost :: error", err);
            throw err;
        } finally {
            setActionLoading(false);
        }
    };

    const deleteBlogPost = async (postId, imageId) => {
        setActionLoading(true);
        try {
            const success = await blogService.deletePost(postId);
            if (success) {
                if (imageId) {
                    await storageService.deleteFile(imageId);
                }
                dispatch(deletePostFromState(postId));
            }
            return success;
        } catch (err) {
            console.error("useBlogs :: deleteBlogPost :: error", err);
            throw err;
        } finally {
            setActionLoading(false);
        }
    };

    const toggleLikeBlogPost = async (postId, currentLikes) => {
        if (!userData) return;
        const userId = userData.$id;

        let baseLikes = currentLikes;
        // If currentLikes was not provided, look up the post in the Redux store list
        if (!baseLikes) {
            const currentPost = posts.find(p => p.$id === postId);
            baseLikes = currentPost ? currentPost.likes : [];
        }

        // Defensive likes extraction
        const cleanLikes = Array.isArray(baseLikes) ? [...baseLikes] : [];
        let updatedLikes;
        if (cleanLikes.includes(userId)) {
            updatedLikes = cleanLikes.filter(id => id !== userId);
        } else {
            updatedLikes = [...cleanLikes, userId];
        }

        try {
            // Update in Redux store (if post is inside the list)
            dispatch(toggleLikePostInState({ postId, userId }));
            
            // update in Appwrite
            const res = await blogService.updateLikes(postId, updatedLikes);
            console.warn("toggleLikeBlogPost database response: ", res);
        } catch (err) {
            console.error("toggleLikeBlogPost error syncing to database: ", err);
        }
    };

    return {
        posts,
        loading,
        error,
        actionLoading,
        searchQuery,
        currentPage,
        postsPerPage,
        fetchPosts,
        fetchAllPostsAdmin,
        fetchUserPosts,
        createBlogPost,
        updateBlogPost,
        deleteBlogPost,
        toggleLikeBlogPost
    };
};
