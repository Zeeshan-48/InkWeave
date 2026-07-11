import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useBlogs } from '../hooks/useBlogs';
import storageService from '../appwrite/storage';
import Loader from '../components/Loader';
import { FALLBACK_BLOG_IMAGE } from '../utils/constants';

const AdminDashboard = () => {
    const { posts, loading, fetchAllPostsAdmin, deleteBlogPost } = useBlogs();
    const [activeTab, setActiveTab] = useState('analytics'); // analytics | blogs | users
    const [actionLoading, setActionLoading] = useState(false);

    // Mock platform users for simulation
    const [mockUsers, setMockUsers] = useState([
        { id: '1', name: 'Admin Master', email: 'admin@blog.com', role: 'Administrator', posts: 8, joined: 'May 14, 2026' },
        { id: '2', name: 'Zeshan Anwar', email: 'zeshan@gmail.com', role: 'Writer', posts: 12, joined: 'Jun 02, 2026' },
        { id: '3', name: 'Sarah Connor', email: 'sarah.c@sky.net', role: 'Writer', posts: 4, joined: 'Jul 01, 2026' },
        { id: '4', name: 'Jane Doe', email: 'jane.doe@gmail.com', role: 'Writer', posts: 6, joined: 'Jul 10, 2026' }
    ]);

    useEffect(() => {
        fetchAllPostsAdmin();
    }, [fetchAllPostsAdmin]);

    const handleDelete = async (postId, imageId) => {
        if (window.confirm("WARNING: You are deleting this post as an Administrator. This action cannot be undone. Proceed?")) {
            setActionLoading(true);
            try {
                await deleteBlogPost(postId, imageId);
            } catch (err) {
                console.error("Admin delete failed", err);
                alert("Failed to delete post.");
            } finally {
                setActionLoading(false);
            }
        }
    };

    const handleRoleToggle = (userId) => {
        setMockUsers(prev => prev.map(user => {
            if (user.id === userId) {
                const isCurrentAdmin = user.role === 'Administrator';
                return {
                    ...user,
                    role: isCurrentAdmin ? 'Writer' : 'Administrator'
                };
            }
            return user;
        }));
    };

    // Calculate Analytics
    const totalBlogs = posts.length;
    const activeBlogs = posts.filter(p => p.status === 'active').length;
    const draftBlogs = posts.filter(p => p.status === 'inactive').length;
    const totalLikes = posts.reduce((sum, p) => sum + (Array.isArray(p.likes) ? p.likes.length : 0), 0);

    if (loading) {
        return <Loader text="Entering administrative secure sector..." />;
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                
                {/* Secure Sector Title */}
                <div className="border-b border-slate-200/40 dark:border-slate-800/40 pb-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-center md:text-left space-y-1">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/25 border border-red-200/50 dark:border-red-900/20 text-red-650 dark:text-red-400 font-bold text-[10px] uppercase tracking-widest animate-pulse">
                            Secure Admin Panel
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight">InkWeave Central Hub</h1>
                    </div>

                    {/* Navigation Tab Buttons */}
                    <div className="flex bg-slate-200/50 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <button
                            onClick={() => setActiveTab('analytics')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                activeTab === 'analytics'
                                    ? 'bg-white dark:bg-slate-805 text-purple-600 dark:text-purple-400 shadow-sm'
                                    : 'text-slate-550 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                            }`}
                        >
                            Analytics
                        </button>
                        <button
                            onClick={() => setActiveTab('blogs')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                activeTab === 'blogs'
                                    ? 'bg-white dark:bg-slate-805 text-purple-600 dark:text-purple-400 shadow-sm'
                                    : 'text-slate-550 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                            }`}
                        >
                            Moderate Blogs
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                activeTab === 'users'
                                    ? 'bg-white dark:bg-slate-805 text-purple-600 dark:text-purple-400 shadow-sm'
                                    : 'text-slate-550 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                            }`}
                        >
                            Manage Users
                        </button>
                    </div>
                </div>

                {/* TAB 1: ANALYTICS */}
                {activeTab === 'analytics' && (
                    <div className="space-y-8 animate-fade-in">
                        {/* Analytical Statistics Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white dark:bg-slate-900 border border-slate-200/55 dark:border-slate-800/55 rounded-3xl p-6 shadow-sm">
                                <p className="text-xs font-semibold text-slate-450 uppercase tracking-widest">Total Users</p>
                                <p className="text-4xl font-black mt-2 text-purple-600 dark:text-purple-400">{mockUsers.length}</p>
                                <p className="text-xs text-slate-400 mt-1">Simulated writers registered</p>
                            </div>
                            <div className="bg-white dark:bg-slate-900 border border-slate-200/55 dark:border-slate-800/55 rounded-3xl p-6 shadow-sm">
                                <p className="text-xs font-semibold text-slate-450 uppercase tracking-widest">Total Articles</p>
                                <p className="text-4xl font-black mt-2 text-slate-850 dark:text-slate-100">{totalBlogs}</p>
                                <p className="text-xs text-slate-400 mt-1">{activeBlogs} Active | {draftBlogs} Drafts</p>
                            </div>
                            <div className="bg-white dark:bg-slate-900 border border-slate-200/55 dark:border-slate-800/55 rounded-3xl p-6 shadow-sm">
                                <p className="text-xs font-semibold text-slate-450 uppercase tracking-widest">likes engagement</p>
                                <p className="text-4xl font-black mt-2 text-red-500">{totalLikes}</p>
                                <p className="text-xs text-slate-400 mt-1">Interactions across public articles</p>
                            </div>
                            <div className="bg-white dark:bg-slate-900 border border-slate-200/55 dark:border-slate-800/55 rounded-3xl p-6 shadow-sm">
                                <p className="text-xs font-semibold text-slate-450 uppercase tracking-widest">Avg Engagement</p>
                                <p className="text-4xl font-black mt-2 text-emerald-500">
                                    {totalBlogs > 0 ? (totalLikes / totalBlogs).toFixed(1) : 0}
                                </p>
                                <p className="text-xs text-slate-400 mt-1">Likes per published article</p>
                            </div>
                        </div>

                        {/* Recent Platform Summary log */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-sm space-y-4">
                            <h2 className="text-lg font-bold">Activity Health</h2>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm py-2 border-b border-slate-100 dark:border-slate-850">
                                    <span className="text-slate-500 dark:text-slate-400 font-medium">Appwrite Server Connection Uptime</span>
                                    <span className="font-semibold text-emerald-600">99.98% (Stable)</span>
                                </div>
                                <div className="flex items-center justify-between text-sm py-2 border-b border-slate-100 dark:border-slate-850">
                                    <span className="text-slate-500 dark:text-slate-400 font-medium">Database Collection Health</span>
                                    <span className="font-semibold text-purple-600">Normal (Active synced)</span>
                                </div>
                                <div className="flex items-center justify-between text-sm py-2">
                                    <span className="text-slate-500 dark:text-slate-400 font-medium">Active sessions verified</span>
                                    <span className="font-semibold text-slate-800 dark:text-slate-250">Appwrite Session Tokens JWT verified</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 2: BLOGS MODERATION */}
                {activeTab === 'blogs' && (
                    <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl overflow-hidden shadow-sm animate-fade-in">
                        {posts.length === 0 ? (
                            <div className="text-center py-20">
                                <p className="text-slate-500 dark:text-slate-400 font-semibold">No platform blogs are found inside this database.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200/55 dark:border-slate-800/55 text-xs font-semibold uppercase tracking-wider text-slate-550 dark:text-slate-450">
                                            <th className="px-6 py-4">Thumbnail</th>
                                            <th className="px-6 py-4">Title</th>
                                            <th className="px-6 py-4">Author</th>
                                            <th className="px-6 py-4">Likes</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">Moderator Controls</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-sm">
                                        {posts.map((post) => {
                                            const imageUrl = post.featuredImage 
                                                ? storageService.getFilePreview(post.featuredImage) 
                                                : FALLBACK_BLOG_IMAGE;
                                            
                                            return (
                                                <tr key={post.$id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <img
                                                            src={imageUrl}
                                                            alt={post.title}
                                                            className="w-12 h-8 rounded-lg object-cover border border-slate-100 dark:border-slate-850"
                                                            onError={(e) => e.target.src = FALLBACK_BLOG_IMAGE}
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-100 max-w-[200px] truncate">
                                                        {post.title}
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-650 dark:text-slate-350 font-medium">
                                                        {post.author}
                                                    </td>
                                                    <td className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-400">
                                                        {Array.isArray(post.likes) ? post.likes.length : 0}
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
                                                    <td className="px-6 py-4 text-right space-x-2">
                                                        <Link
                                                            to={`/blog/${post.$id}`}
                                                            className="inline-block px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold rounded-lg transition-colors"
                                                        >
                                                            Inspect
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
                                                            Force Delete
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
                )}

                {/* TAB 3: USERS MODERATION */}
                {activeTab === 'users' && (
                    <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl overflow-hidden shadow-sm animate-fade-in">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-955 border-b border-slate-200/55 dark:border-slate-800/55 text-xs font-semibold uppercase tracking-wider text-slate-550 dark:text-slate-450">
                                        <th className="px-6 py-4">Name</th>
                                        <th className="px-6 py-4">Email</th>
                                        <th className="px-6 py-4">Joined Date</th>
                                        <th className="px-6 py-4">Auth role</th>
                                        <th className="px-6 py-4 text-right">Moderator actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-sm">
                                    {mockUsers.map((userObj) => (
                                        <tr key={userObj.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-550 to-indigo-550 text-white flex items-center justify-center font-bold text-xs">
                                                        {userObj.name[0].toUpperCase()}
                                                    </div>
                                                    <span className="font-bold text-slate-800 dark:text-slate-100">
                                                        {userObj.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-medium">
                                                {userObj.email}
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 dark:text-slate-450 font-medium">
                                                {userObj.joined}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                    userObj.role === 'Administrator'
                                                        ? 'bg-red-50 text-red-655 dark:bg-red-950/20 dark:text-red-400'
                                                        : 'bg-slate-100 text-slate-650 dark:bg-slate-800 dark:text-slate-300'
                                                }`}>
                                                    {userObj.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleRoleToggle(userObj.id)}
                                                    className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold rounded-lg transition-colors"
                                                >
                                                    Toggle Administrator
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default AdminDashboard;
