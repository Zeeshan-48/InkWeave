import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useBlogs } from '../hooks/useBlogs';
import storageService from '../appwrite/storage';
import Loader from '../components/Loader';
import { FALLBACK_BLOG_IMAGE } from '../utils/constants';

const Dashboard = () => {
    const { user } = useAuth();
    const { posts, loading, fetchUserPosts, updateBlogPost, deleteBlogPost } = useBlogs();
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        if (user?.$id) {
            fetchUserPosts(user.$id);
        }
    }, [fetchUserPosts, user?.$id]);

    const myPosts = posts.filter(post => (post.userID || post.userId) === user?.$id);
    const activePostsCount = myPosts.filter(p => p.status === 'active').length;
    const inactivePostsCount = myPosts.filter(p => p.status === 'inactive').length;

    const handleDelete = async (postId, imageId) => {
        if (window.confirm("Are you sure you want to permanently delete this article?")) {
            setActionLoading(true);
            try {
                await deleteBlogPost(postId, imageId);
            } catch (err) {
                console.error("Delete from dashboard failed", err);
                alert("Failed to delete post.");
            } finally {
                setActionLoading(false);
            }
        }
    };

    const handleToggleStatus = async (postItem) => {
        setActionLoading(true);
        try {
            const nextStatus = postItem.status === 'active' ? 'inactive' : 'active';
            const imgId = postItem.featuredImage || postItem.featuredimage || postItem.image;
            await updateBlogPost(postItem.$id, {
                title: postItem.title,
                content: postItem.content,
                status: nextStatus,
                oldImageId: imgId
            });
        } catch (err) {
            console.error("Dashboard :: Toggle status failed", err);
            alert("Failed to update status.");
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return <Loader text="Loading your dashboard panel..." />;
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                
                {/* Header Summary */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200/40 dark:border-slate-800/40 pb-6">
                    <div className="text-center sm:text-left space-y-1">
                        <h1 className="text-3xl font-extrabold tracking-tight">
                            Writer Dashboard
                        </h1>
                        <p className="text-sm text-slate-550 dark:text-slate-400 font-medium">
                            Monitor, publish, edit, and moderate your personal articles.
                        </p>
                    </div>
                    <Link
                        to="/create-blog"
                        className="px-5 py-3 bg-purple-600 hover:bg-purple-755 text-white font-bold text-sm rounded-xl shadow-lg shadow-purple-500/10 transition-colors flex items-center gap-1.5"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Create Post</span>
                    </Link>
                </div>

                {/* Analytical Mini Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-6 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Written</p>
                            <p className="text-3xl font-black mt-1 text-slate-800 dark:text-slate-100">{myPosts.length}</p>
                        </div>
                        <div className="p-3 bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 rounded-xl">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-6 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Published</p>
                            <p className="text-3xl font-black mt-1 text-emerald-600 dark:text-emerald-400">{activePostsCount}</p>
                        </div>
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-xl">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-6 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Drafts</p>
                            <p className="text-3xl font-black mt-1 text-amber-500 dark:text-amber-450">{inactivePostsCount}</p>
                        </div>
                        <div className="p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-500 dark:text-amber-400 rounded-xl">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Table list of blogs */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl overflow-hidden shadow-sm">
                    {myPosts.length === 0 ? (
                        <div className="text-center py-20 space-y-4">
                            <p className="text-slate-500 dark:text-slate-450 font-medium">You haven't written any posts yet.</p>
                            <Link to="/create-blog" className="inline-block px-4 py-2 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 font-bold text-xs rounded-xl transition-all">
                                Write First Post
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200/55 dark:border-slate-800/55 text-xs font-semibold uppercase tracking-wider text-slate-550 dark:text-slate-450">
                                        <th className="px-6 py-4">Cover</th>
                                        <th className="px-6 py-4">Title</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Likes</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-sm">
                                    {myPosts.map((post) => {
                                        const imageUrl = post.featuredImage 
                                            ? storageService.getFilePreview(post.featuredImage) 
                                            : FALLBACK_BLOG_IMAGE;
                                        
                                        const likesList = post.likes || post.Likes || post.like || [];

                                        return (
                                            <tr key={post.$id} className="group hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-all duration-300">
                                                <td className="px-6 py-4">
                                                    <div className="w-12 h-8 rounded-lg overflow-hidden border border-slate-100 dark:border-slate-850">
                                                        <img
                                                            src={imageUrl}
                                                            alt={post.title}
                                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                            onError={(e) => e.target.src = FALLBACK_BLOG_IMAGE}
                                                        />
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-100 line-clamp-1 max-w-60 pt-6 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                                                    {post.title}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                        post.status === 'active'
                                                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400'
                                                            : 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400'
                                                    }`}>
                                                        {post.status === 'active' ? 'Active' : 'Draft'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-400">
                                                    {likesList.length}
                                                </td>
                                                <td className="px-6 py-4 text-right space-x-2">
                                                    <button
                                                        onClick={() => handleToggleStatus(post)}
                                                        disabled={actionLoading}
                                                        className={`inline-block px-3 py-1.5 text-xs font-bold rounded-lg transition-colors disabled:opacity-50 ${
                                                            post.status === 'active'
                                                                ? 'bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400'
                                                                : 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400'
                                                        }`}
                                                    >
                                                        {post.status === 'active' ? 'Draft It' : 'Go Live'}
                                                    </button>
                                                    <Link
                                                        to={`/blog/${post.$id}`}
                                                        className="inline-block px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold rounded-lg transition-colors"
                                                    >
                                                        View
                                                    </Link>
                                                    <Link
                                                        to={`/edit-blog/${post.$id}`}
                                                        className="inline-block px-3 py-1.5 border border-purple-200 hover:border-purple-300 dark:border-purple-800/80 dark:hover:border-purple-700 text-purple-600 dark:text-purple-400 text-xs font-bold rounded-lg transition-colors"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(post.$id, post.featuredImage)}
                                                        disabled={actionLoading}
                                                        className="inline-block px-3 py-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 text-red-655 dark:text-red-400 text-xs font-bold rounded-lg transition-colors disabled:opacity-50"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
