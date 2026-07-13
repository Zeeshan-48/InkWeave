import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Editor } from '@tinymce/tinymce-react';
import { useNavigate } from 'react-router-dom';
import storageService from '../appwrite/storage';
import { useBlogs } from '../hooks/useBlogs';

const BlogForm = ({ post }) => {
    const { register, handleSubmit, control, formState: { errors } } = useForm({
        defaultValues: {
            title: post?.title || '',
            status: post?.status || 'active',
            content: post?.content || ''
        }
    });

    const navigate = useNavigate();
    const { createBlogPost, updateBlogPost, actionLoading } = useBlogs();
    const [imagePreview, setImagePreview] = useState(() => {
        const imgId = post?.featuredImage || post?.featuredimage || post?.image;
        return imgId ? storageService.getFilePreview(imgId) : null;
    });
    const [imageFile, setImageFile] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data) => {
        try {
            if (post) {
                // Edit existing post
                const res = await updateBlogPost(post.$id, {
                    title: data.title,
                    content: data.content,
                    status: data.status,
                    imageFile,
                    oldImageId: post.featuredImage
                });
                if (res) navigate(`/blog/${post.$id}`);
            } else {
                // Create new post
                const res = await createBlogPost({
                    title: data.title,
                    content: data.content,
                    status: data.status,
                    imageFile
                });
                if (res) navigate('/dashboard');
            }
        } catch (error) {
            console.error("BlogForm :: onSubmit error", error);
            alert("An error occurred while saving the blog. Please check your console.");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl mx-auto bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Inputs (Title & Editor) */}
                <div className="lg:col-span-2 space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-semibold text-slate-700 dark:text-slate-350 mb-2">
                            Blog Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            dir="ltr"
                            placeholder="Enter a compelling title..."
                            className={`w-full text-left px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border ${
                                errors.title ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'
                            } text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-550 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all`}
                            {...register('title', { 
                                required: 'Title is required',
                                minLength: { value: 5, message: 'Title must be at least 5 characters long' }
                            })}
                        />
                        {errors.title && (
                            <p className="mt-1 text-xs text-red-500 font-medium">{errors.title.message}</p>
                        )}
                    </div>

                    <div dir="ltr">
                        <label htmlFor="content-editor" className="block text-sm font-semibold text-slate-700 dark:text-slate-350 mb-2">
                            Content
                        </label>
                        <Controller
                            name="content"
                            control={control}
                            rules={{ required: 'Content is required' }}
                            render={({ field: { onChange, value } }) => (
                                <Editor
                                    id="content-editor"
                                    initialValue={post?.content || ''}
                                    apiKey={import.meta.env.VITE_TINYMCE_API_KEY || "no-api-key"}
                                    init={{
                                        height: 350,
                                        menubar: false,
                                        directionality: 'ltr',
                                        plugins: 'advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table code help wordcount directionality',
                                        toolbar:
                                            'ltr rtl | undo redo | formatselect | bold italic backcolor | \
                                            alignleft aligncenter alignright alignjustify | \
                                            bullist numlist outdent indent | removeformat | help',
                                        content_style: 'body { font-family:Inter,sans-serif; font-size:14px; }',
                                        skin: window.document.documentElement.classList.contains('dark') ? 'oxide-dark' : 'oxide',
                                        content_css: window.document.documentElement.classList.contains('dark') ? 'dark' : 'default'
                                    }}
                                    onEditorChange={onChange}
                                />
                            )}
                        />
                        {errors.content && (
                            <p className="mt-1 text-xs text-red-500 font-medium">{errors.content.message}</p>
                        )}
                    </div>
                </div>

                {/* Sidebar (File Upload & Status) */}
                <div className="space-y-6">
                    {/* Featured Image */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-350 mb-2">
                            Featured Image
                        </label>
                        <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-purple-500 dark:hover:border-purple-400 rounded-2xl p-4 transition-colors relative flex flex-col items-center justify-center min-h-55">
                            {imagePreview ? (
                                <div className="space-y-3 w-full">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-36 object-cover rounded-xl border border-slate-100 dark:border-slate-800"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setImagePreview(null);
                                            setImageFile(null);
                                        }}
                                        className="w-full py-2 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-950/40 rounded-xl text-xs font-semibold transition-colors"
                                    >
                                        Remove Image
                                    </button>
                                </div>
                            ) : (
                                <label htmlFor="featuredImage" className="cursor-pointer flex flex-col items-center justify-center p-6 text-center space-y-2">
                                    <svg className="w-10 h-10 text-slate-400 dark:text-slate-500 animate-pulse-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                                        Upload Image File
                                    </span>
                                    <span className="text-[10px] text-slate-400 dark:text-slate-550">
                                        JPG, PNG, GIF up to 5MB
                                    </span>
                                    <input
                                        type="file"
                                        id="featuredImage"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Status Toggle */}
                    <div>
                        <label htmlFor="status" className="block text-sm font-semibold text-slate-700 dark:text-slate-350 mb-2">
                            Publish Status
                        </label>
                        <select
                            id="status"
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium"
                            {...register('status')}
                        >
                            <option value="active">Active (Visible)</option>
                            <option value="inactive">Inactive (Draft)</option>
                        </select>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={actionLoading}
                        className="w-full py-3.5 bg-linear-to-tr from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-purple-500/20 focus:outline-none focus:ring-2 focus:ring-purple-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                    >
                        {actionLoading && (
                            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        <span>{post ? 'Save Modifications' : 'Publish Blog Post'}</span>
                    </button>
                </div>
            </div>
        </form>
    );
};

export default BlogForm;
