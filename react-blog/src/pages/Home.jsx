import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useBlogs } from '../hooks/useBlogs';
import BlogCard from '../components/BlogCard';
import { SkeletonCard } from '../components/Loader';
import { setSearchQuery, setCurrentPage } from '../redux/blogSlice';

const Home = () => {
    const { posts, loading, fetchPosts } = useBlogs();
    const { searchQuery, currentPage, postsPerPage } = useSelector((state) => state.blogs);
    const dispatch = useDispatch();

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const handleSearchChange = (e) => {
        dispatch(setSearchQuery(e.target.value));
    };

    // Filter posts based on search query
    const filteredPosts = posts.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.content && post.content.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Pagination calculations
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

    const handlePageChange = (pageNumber) => {
        dispatch(setCurrentPage(pageNumber));
        window.scrollTo({ top: 400, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
            
            {/* Hero Header Section */}
            <header className="relative py-20 overflow-hidden bg-linear-to-br from-purple-900/10 via-indigo-900/5 to-transparent dark:from-purple-950/20 dark:via-indigo-950/10 border-b border-slate-200/40 dark:border-slate-800/40">
                <div className="max-w-5xl mx-auto px-4 text-center space-y-6 relative z-10">
                    <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
                        Unveil the Magic of{' '}
                        <span className="bg-linear-to-r from-purple-600 via-indigo-600 to-blue-600 dark:from-purple-400 dark:via-indigo-400 dark:to-blue-400 bg-clip-text text-transparent">
                            Digital Storytelling
                        </span>
                    </h1>
                    <p className="text-lg sm:text-xl text-slate-650 dark:text-slate-350 max-w-2xl mx-auto font-medium">
                        Welcome to InkWeave. Discover insightful blogs, design assets, developer notes, and structural coding practices written by creators worldwide.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-md mx-auto pt-4 relative">
                        <label htmlFor="search-blogs" className="sr-only">Search articles</label>
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            id="search-blogs"
                            placeholder="Search articles by title or keyword..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 shadow-sm transition-all text-sm font-medium"
                        />
                    </div>
                </div>

                {/* Decorative glowing blobs */}
                <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-purple-500/10 dark:bg-purple-500/5 blur-3xl -z-10"></div>
                <div className="absolute top-1/3 right-1/4 -translate-y-1/2 translate-x-1/2 w-80 h-80 rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-3xl -z-10"></div>
            </header>

            {/* Main Content Grid */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                
                {loading ? (
                    /* Skeletons on loading */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                ) : filteredPosts.length === 0 ? (
                    /* Empty state */
                    <div className="text-center py-20 space-y-4">
                        <div className="inline-flex p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364.364l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">No Articles Found</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-450 max-w-sm mx-auto">
                            We couldn't find any articles matching "{searchQuery}". Try updating your spelling or starting another search query.
                        </p>
                    </div>
                ) : (
                    /* Blog list rendering */
                    <div className="space-y-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {currentPosts.map((post) => (
                                <BlogCard key={post.$id} post={post} />
                            ))}
                        </div>

                        {/* Pagination Component */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 pt-6">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-850 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                                    aria-label="Previous Page"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                
                                {[...Array(totalPages)].map((_, idx) => {
                                    const pageNum = idx + 1;
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => handlePageChange(pageNum)}
                                            className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
                                                currentPage === pageNum
                                                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/10'
                                                    : 'border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-850'
                                            }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-850 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                                    aria-label="Next Page"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Home;
