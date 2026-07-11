import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { validateEmail, validatePassword } from '../utils/validators';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { loginUser, loading, error: authError } = useAuth();
    const navigate = useNavigate();
    const [localError, setLocalError] = useState('');

    const onSubmit = async (data) => {
        setLocalError('');
        try {
            await loginUser({ email: data.email, password: data.password });
            navigate('/dashboard');
        } catch (err) {
            setLocalError(err?.message || "Invalid credentials. Please try again.");
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-50 dark:bg-slate-950 transition-colors">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-8 shadow-xl space-y-6">
                
                {/* Header */}
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
                        Welcome Back
                    </h2>
                    <p className="text-sm text-slate-550 dark:text-slate-400">
                        Sign in to check and manage your personal content
                    </p>
                </div>

                {/* Error Notifications */}
                {(localError || authError) && (
                    <div className="p-3.5 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl text-sm text-red-650 dark:text-red-400 font-medium">
                        {localError || authError}
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Email Input */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="you@example.com"
                            className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border ${
                                errors.email ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'
                            } text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all`}
                            {...register('email', { 
                                required: 'Email is required',
                                validate: validateEmail
                            })}
                        />
                        {errors.email && (
                            <p className="mt-1 text-xs text-red-500 font-medium">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Password Input */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            placeholder="••••••••"
                            className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border ${
                                errors.password ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'
                            } text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all`}
                            {...register('password', { 
                                required: 'Password is required',
                                validate: validatePassword
                            })}
                        />
                        {errors.password && (
                            <p className="mt-1 text-xs text-red-500 font-medium">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Action Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-linear-to-tr from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-purple-500/10 focus:outline-none disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                    >
                        {loading && (
                            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        <span>Sign In</span>
                    </button>
                </form>

                {/* Footer Signup Prompt */}
                <div className="text-center pt-2">
                    <p className="text-sm text-slate-550 dark:text-slate-400">
                        Don't have an account?{' '}
                        <Link to="/signup" className="font-semibold text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300">
                            Create free account
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    );
};

export default Login;
