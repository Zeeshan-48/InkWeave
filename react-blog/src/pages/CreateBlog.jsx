import React from 'react';
import BlogForm from '../components/BlogForm';

const CreateBlog = () => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 py-12">
            <div className="max-w-4xl mx-auto px-4 space-y-6">
                <div className="space-y-2 text-center sm:text-left">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
                        Write New Article
                    </h1>
                    <p className="text-sm text-slate-550 dark:text-slate-400">
                        Craft a beautiful post, upload a stunning cover image, and publish it to the community.
                    </p>
                </div>

                {/* Create Blog Form Wrapper */}
                <BlogForm />
            </div>
        </div>
    );
};

export default CreateBlog;
