import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { SYSTEM_TITLE, THEME_KEY } from '../utils/constants';

const Navbar = () => {
    const { isAuthenticated, isAdmin, user, logoutUser } = useAuth();
    const navigate = useNavigate();
    const [theme, setTheme] = useState(localStorage.getItem(THEME_KEY) || 'light');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem(THEME_KEY, theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const handleLogout = async () => {
        try {
            await logoutUser();
            setProfileDropdownOpen(false);
            navigate('/login');
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    const navLinkClass = ({ isActive }) => 
        `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            isActive 
                ? 'text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-950/30' 
                : 'text-slate-600 dark:text-slate-300 hover:text-purple-600 hover:bg-slate-50 dark:hover:bg-slate-800/50'
        }`;

    return (
        <nav className="glass sticky top-0 z-40 w-full border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm bg-white/80 dark:bg-slate-900/80 backdrop-blur-md transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Brand/Logo */}
                    <div className="shrink-0 flex items-center">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
                                I
                            </div>
                            <span className="text-xl font-bold bg-linear-to-r from-purple-600 via-indigo-600 to-blue-600 dark:from-purple-400 dark:via-indigo-400 dark:to-blue-400 bg-clip-text text-transparent tracking-tight">
                                {SYSTEM_TITLE}
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center space-x-2">
                        <NavLink to="/" className={navLinkClass}>Home</NavLink>
                        {isAuthenticated && (
                            <>
                                <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
                                <NavLink to="/profile" className={navLinkClass}>Profile</NavLink>
                                {isAdmin && (
                                    <NavLink to="/admin" className={navLinkClass}>
                                        Admin Panel
                                    </NavLink>
                                )}
                            </>
                        )}
                    </div>

                    {/* Right utilities (Theme, Auth, Mobile Menu Btn) */}
                    <div className="flex items-center space-x-4">
                        {/* Theme Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
                            aria-label="Toggle Theme"
                        >
                            {theme === 'light' ? (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m2.828 0l-.707-.707m2.828-12.728l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                                </svg>
                            )}
                        </button>

                        {/* User Profile dropdown or Login option */}
                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                                    className="flex items-center gap-2 focus:outline-none p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-500 to-indigo-500 text-white flex items-center justify-center font-bold shadow-inner">
                                        {user?.name ? user.name[0].toUpperCase() : 'U'}
                                    </div>
                                    <span className="hidden sm:inline text-sm font-medium text-slate-700 dark:text-slate-300 pr-1">
                                        {user?.name}
                                    </span>
                                </button>

                                {profileDropdownOpen && (
                                    <>
                                        {/* Click overlay */}
                                        <div className="fixed inset-0 z-10" onClick={() => setProfileDropdownOpen(false)}></div>
                                        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-1 z-20">
                                            <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                                                <p className="text-xs font-semibold text-purple-600 dark:text-purple-400">Signed in as</p>
                                                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user?.email}</p>
                                            </div>
                                            <Link
                                                to="/profile"
                                                onClick={() => setProfileDropdownOpen(false)}
                                                className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                                            >
                                                My Profile
                                            </Link>
                                            <Link
                                                to="/dashboard"
                                                onClick={() => setProfileDropdownOpen(false)}
                                                className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                                            >
                                                Dashboard
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 font-medium"
                                            >
                                                Log Out
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="hidden md:flex items-center space-x-2">
                                <Link
                                    to="/login"
                                    className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                >
                                    Log In
                                </Link>
                                <Link
                                    to="/signup"
                                    className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-500/10 transition-colors"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden transition-colors focus:outline-none"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? (
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-slate-200/50 dark:border-slate-800/50 px-2 pt-2 pb-4 space-y-1 bg-white dark:bg-slate-900 transition-colors">
                    <NavLink
                        to="/"
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) => `block px-3 py-2 rounded-lg text-base font-medium ${isActive ? 'bg-purple-50 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                    >
                        Home
                    </NavLink>
                    {isAuthenticated ? (
                        <>
                            <NavLink
                                to="/dashboard"
                                onClick={() => setMobileMenuOpen(false)}
                                className={({ isActive }) => `block px-3 py-2 rounded-lg text-base font-medium ${isActive ? 'bg-purple-50 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                            >
                                Dashboard
                            </NavLink>
                            <NavLink
                                to="/profile"
                                onClick={() => setMobileMenuOpen(false)}
                                className={({ isActive }) => `block px-3 py-2 rounded-lg text-base font-medium ${isActive ? 'bg-purple-50 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                            >
                                Profile
                            </NavLink>
                            {isAdmin && (
                                <NavLink
                                    to="/admin"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={({ isActive }) => `block px-3 py-2 rounded-lg text-base font-medium ${isActive ? 'bg-purple-50 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                                >
                                    Admin Panel
                                </NavLink>
                            )}
                            <button
                                onClick={handleLogout}
                                className="w-full text-left block px-3 py-2 rounded-lg text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/10"
                            >
                                Log Out
                            </button>
                        </>
                    ) : (
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-850 flex flex-col gap-2">
                            <Link
                                to="/login"
                                onClick={() => setMobileMenuOpen(false)}
                                className="w-full text-center px-4 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                Log In
                            </Link>
                            <Link
                                to="/signup"
                                onClick={() => setMobileMenuOpen(false)}
                                className="w-full text-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 shadow-md"
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
