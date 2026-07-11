import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useBlogs } from '../hooks/useBlogs';
import BlogCard from '../components/BlogCard';

const Profile = () => {
    const { user } = useAuth();
    const { posts, fetchPosts } = useBlogs();

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    // Filter posts written by the logged-in user
    const myPosts = posts.filter(post => (post.userID || post.userId) === user?.$id);

    // Sum up total likes on my posts
    const totalLikes = myPosts.reduce((sum, post) => {
        const likesList = post.likes || post.Likes || post.like || [];
        return sum + (Array.isArray(likesList) ? likesList.length : 0);
    }, 0);

    const registrationDate = user?.registration 
        ? new Date(user.registration).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
          })
        : 'Sometime recently';

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                
                {/* Profile Card Header */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                        {/* Avatar */}
                        <div className="w-20 h-20 rounded-3xl bg-linear-to-tr from-purple-600 to-indigo-650 text-white flex items-center justify-center font-black text-3xl shadow-lg shadow-purple-500/10">
                            {user?.name ? user.name[0].toUpperCase() : 'U'}
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
                                {user?.name}
                            </h1>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                {user?.email}
                            </p>
                            <p className="text-xs text-slate-400 dark:text-slate-550">
                                Active writer since {registrationDate}
                            </p>
                        </div>
                    </div>

                    {/* Stats Dashboard */}
                    <div className="flex gap-4 sm:gap-6">
                        <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850 rounded-2xl text-center">
                            <p className="text-2xl font-black text-purple-600 dark:text-purple-400">
                                {myPosts.length}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold tracking-wider uppercase">
                                Articles
                            </p>
                        </div>
                        <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850 rounded-2xl text-center">
                            <p className="text-2xl font-black text-red-500 dark:text-red-400">
                                {totalLikes}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold tracking-wider uppercase">
                                Likes
                            </p>
                        </div>
                    </div>
                </div>

                {/* Published Articles List */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-200/40 dark:border-slate-800/40 pb-4">
                        <h2 className="text-2xl font-extrabold text-slate-850 dark:text-slate-100">
                            My Publications
                        </h2>
                        <Link
                            to="/create-blog"
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-755 text-white font-bold text-xs rounded-xl shadow-md shadow-purple-500/10 transition-colors"
                        >
                            Write Article
                        </Link>
                    </div>

                    {myPosts.length === 0 ? (
                        <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl space-y-4">
                            <p className="text-slate-500 dark:text-slate-450 font-medium">
                                You haven't published any articles yet.
                            </p>
                            <Link
                                to="/create-blog"
                                className="inline-block text-sm text-purple-600 hover:text-purple-500 dark:text-purple-400 font-bold"
                            >
                                Start your first post &rarr;
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {myPosts.map((post) => (
                                <BlogCard key={post.$id} post={post} />
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Profile;
