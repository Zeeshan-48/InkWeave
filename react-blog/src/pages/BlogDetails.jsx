import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import parse from 'html-react-parser';
import blogService from '../appwrite/database';
import storageService from '../appwrite/storage';
import { useAuth } from '../hooks/useAuth';
import { useBlogs } from '../hooks/useBlogs';
import Loader from '../components/Loader';
import { FALLBACK_BLOG_IMAGE } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { addPost, updatePostInState } from '../redux/blogSlice';

const BlogDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, isAuthenticated, isAdmin } = useAuth();
    const { toggleLikeBlogPost, deleteBlogPost } = useBlogs();
    
    const posts = useSelector((state) => state.blogs.posts);
    const post = posts.find(p => p.$id === id);
    const [loading, setLoading] = useState(!post);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        const fetchPostDetails = async () => {
            try {
                const res = await blogService.getPost(id);
                if (res) {
                    const exists = posts.some(p => p.$id === res.$id);
                    if (exists) {
                        dispatch(updatePostInState(res));
                    } else {
                        dispatch(addPost(res));
                    }
                }
            } catch (err) {
                console.error("BlogDetails :: Error fetching details", err);
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchPostDetails();
        }
    }, [id, dispatch, navigate]);

    if (loading && !post) {
        return <Loader fullScreen text="Opening the scroll..." />;
    }

    if (!post) {
        return (
            <div className="text-center py-20 bg-slate-50 dark:bg-slate-950 min-h-[60vh] flex flex-col justify-center items-center">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Post Not Found</h3>
                <Link to="/" className="mt-4 text-purple-600 font-semibold hover:underline">
                    Back to Home
                </Link>
            </div>
        );
    }

    const {
        title,
        content = '',
        featuredImage,
        author = 'Anonymous',
        createdAt,
        userId,
        userID
    } = post;

    const likesList = post.likes || post.Likes || post.like || [];

    const isAuthor = user && user.$id === (userID || userId);
    const canModerate = isAuthor || isAdmin;
    const isLiked = user && likesList.includes(user.$id);

    const imgId = post.featuredImage || post.featuredimage || post.image;
    const imageUrl = imgId 
        ? storageService.getFilePreview(imgId) 
        : FALLBACK_BLOG_IMAGE;

    const formattedDate = (createdAt || post.$createdAt) 
        ? new Date(createdAt || post.$createdAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
          })
        : 'Recently';

    const handleLikeClick = async () => {
        if (!isAuthenticated) {
            alert("Please log in to like articles.");
            return;
        }
        
        await toggleLikeBlogPost(post.$id, likesList);
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to permanently delete this blog post?")) {
            setActionLoading(true);
            try {
                const res = await deleteBlogPost(post.$id, featuredImage);
                if (res) navigate('/dashboard');
            } catch (err) {
                console.error("Delete failed", err);
                alert("Could not delete post.");
            } finally {
                setActionLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 py-12">
            <article className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
                
                {/* Back Button Navigation */}
                <div className="flex items-center justify-between">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-650 hover:text-purple-650 dark:text-slate-400 dark:hover:text-purple-400 transition-colors group"
                    >
                        <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7 7-7" />
                        </svg>
                        <span>Back to Feed</span>
                    </Link>

                    {/* Moderate Options */}
                    {canModerate && (
                        <div className="flex gap-2">
                            <Link
                                to={`/edit-blog/${post.$id}`}
                                className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                Edit Post
                            </Link>
                            <button
                                onClick={handleDelete}
                                disabled={actionLoading}
                                className="px-4 py-2 bg-red-50 text-red-655 dark:bg-red-950/20 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/45 rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
                            >
                                {actionLoading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    )}
                </div>

                {/* Banner / Cover Image */}
                <div className="aspect-video w-full rounded-3xl overflow-hidden border border-slate-250/50 dark:border-slate-800 shadow-lg bg-slate-100 dark:bg-slate-900">
                    <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.src = FALLBACK_BLOG_IMAGE;
                        }}
                    />
                </div>

                {/* Header Information */}
                <div className="space-y-4 text-center sm:text-left">
                    <div className="inline-flex px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/25 text-purple-600 dark:text-purple-400 font-semibold text-xs uppercase tracking-wider">
                        Article Publication
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                        {title}
                    </h1>

                    {/* Author Meta Details */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/50 dark:border-slate-800/50 pb-6">
                        <div className="flex items-center gap-3 justify-center sm:justify-start">
                            <div className="w-10 h-10 rounded-full bg-linear-to-tr from-purple-500 to-indigo-500 text-white flex items-center justify-center font-bold">
                                {author[0].toUpperCase()}
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                                    {author}
                                </p>
                                <p className="text-xs text-slate-400 dark:text-slate-500">
                                    Published on {formattedDate}
                                </p>
                            </div>
                        </div>

                        {/* Detail Like Toggle */}
                        <div className="flex items-center justify-center gap-3">
                            <button
                                onClick={handleLikeClick}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-colors text-sm font-bold shadow-sm ${
                                    isLiked
                                        ? 'bg-red-50 text-red-500 border border-red-200 dark:bg-red-950/20 dark:border-red-900/30'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:text-red-500 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:text-red-400'
                                }`}
                            >
                                <svg
                                    className={`w-5 h-5 transition-transform duration-250 ${isLiked ? 'fill-current scale-110' : ''}`}
                                    fill={isLiked ? 'currentColor' : 'none'}
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                <span>{isLiked ? 'Liked' : 'Like Article'}</span>
                            </button>
                            <span className="inline-flex items-center justify-center px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-xs font-black text-slate-600 dark:text-slate-300 font-mono shadow-inner">
                                {likesList.length} {likesList.length === 1 ? 'Like' : 'Likes'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Article Body Content */}
                <div className="prose prose-purple dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed font-normal text-base sm:text-lg select-text mt-4 space-y-4">
                    {parse(content)}
                </div>

            </article>
        </div>
    );
};

export default BlogDetails;
