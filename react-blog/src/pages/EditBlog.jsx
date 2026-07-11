import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import blogService from '../appwrite/database';
import BlogForm from '../components/BlogForm';
import Loader from '../components/Loader';

const EditBlog = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await blogService.getPost(id);
                if (res) {
                    setPost(res);
                } else {
                    navigate('/dashboard');
                }
            } catch (err) {
                console.error("EditPost :: error loading post details", err);
                navigate('/dashboard');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchPost();
    }, [id, navigate]);

    if (loading) {
        return <Loader fullScreen text="Loading article draft..." />;
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 py-12">
            <div className="max-w-4xl mx-auto px-4 space-y-6">
                <div className="space-y-2 text-center sm:text-left">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
                        Edit Article
                    </h1>
                    <p className="text-sm text-slate-550 dark:text-slate-400">
                        Revise your writing, update the cover header, or adjust publishing statuses.
                    </p>
                </div>

                {/* Edit Form */}
                {post && <BlogForm post={post} />}
            </div>
        </div>
    );
};

export default EditBlog;
