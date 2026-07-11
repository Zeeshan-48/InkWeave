import React from 'react';
import { Link } from 'react-router-dom';
import storageService from '../appwrite/storage';
import { useBlogs } from '../hooks/useBlogs';
import { useAuth } from '../hooks/useAuth';
import { FALLBACK_BLOG_IMAGE } from '../utils/constants';

const BlogCard = ({ post }) => {
    const { toggleLikeBlogPost } = useBlogs();
    const { user, isAuthenticated } = useAuth();
    const {
        $id,
        title,
        content = '',
        featuredImage,
        author = 'Anonymous',
        createdAt
    } = post;

    const likesList = post.likes || post.Likes || post.like || [];

    const imgId = post.featuredImage || post.featuredimage || post.image;
    const imageUrl = imgId 
        ? storageService.getFilePreview(imgId) 
        : FALLBACK_BLOG_IMAGE;

    console.warn("BlogCard post image: " + post.featuredImage + " | imgId: " + imgId + " | imageUrl: " + imageUrl);

    const formattedDate = (createdAt || post.$createdAt) 
        ? new Date(createdAt || post.$createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
          })
        : 'Recently';

    // Strip HTML tags for clean description teaser
    const cleanDescription = content
        .replace(/<\/?[^>]+(>|$)/g, "")
        .substring(0, 120) + (content.length > 120 ? '...' : '');

    const isLiked = user && Array.isArray(likesList) && likesList.includes(user.$id);

    const handleLikeClick = (e) => {
        e.preventDefault(); // Prevent navigating to blog details when clicking like
        if (!isAuthenticated) {
            alert("Please log in to like posts.");
            return;
        }
        toggleLikeBlogPost($id, likesList);
    };

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col hover-lift group">
            {/* Thumbnail Image Container */}
            <Link to={`/blog/${$id}`} className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                    onError={(e) => {
                        e.target.src = FALLBACK_BLOG_IMAGE;
                    }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-350"></div>
            </Link>

            {/* Content Details */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                    {/* Meta tag / Category */}
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span className="px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 font-semibold uppercase tracking-wider scale-95">
                            Article
                        </span>
                        <span>{formattedDate}</span>
                    </div>

                    {/* Blog Title */}
                    <Link to={`/blog/${$id}`}>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2 leading-snug">
                            {title}
                        </h3>
                    </Link>

                    {/* Teaser Description */}
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                        {cleanDescription}
                    </p>
                </div>

                {/* Author Info & Interaction Footer */}
                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/50 pt-4 mt-auto">
                    {/* Author */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-linear-to-tr from-purple-500 to-indigo-500 text-white flex items-center justify-center font-bold text-xs shadow-inner">
                            {author[0].toUpperCase()}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                {author}
                            </p>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                Author
                            </p>
                        </div>
                    </div>

                    {/* Like Action */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleLikeClick}
                            className={`flex items-center justify-center p-2 rounded-full transition-colors ${
                                isLiked
                                    ? 'bg-red-50 text-red-500 dark:bg-red-950/20'
                                    : 'bg-slate-50 text-slate-500 hover:text-red-500 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-red-400'
                            }`}
                            aria-label="Like Post"
                        >
                            <svg
                                className={`w-4 h-4 transition-transform duration-200 ${isLiked ? 'fill-current scale-110' : ''}`}
                                fill={isLiked ? 'currentColor' : 'none'}
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 min-w-3">
                            {Array.isArray(likesList) ? likesList.length : 0}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogCard;
