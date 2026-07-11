import React from 'react';

const Loader = ({ fullScreen = false, text = "Loading the canvas..." }) => {
    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md">
                <div className="relative flex items-center justify-center">
                    {/* Ring 1 */}
                    <div className="w-20 h-20 border-4 border-purple-500/20 border-t-purple-600 rounded-full animate-spin"></div>
                    {/* Ring 2 */}
                    <div className="absolute w-14 h-14 border-4 border-indigo-500/20 border-b-indigo-500 rounded-full animate-spin-reverse animate-duration-1000"></div>
                    {/* Glowing center dot */}
                    <div className="absolute w-4 h-4 bg-purple-500 rounded-full shadow-lg shadow-purple-500 animate-pulse"></div>
                </div>
                <p className="mt-6 text-sm font-semibold tracking-wider text-slate-600 dark:text-slate-400 uppercase animate-pulse">
                    {text}
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center py-12">
            <div className="relative flex items-center justify-center">
                <div className="w-12 h-12 border-3 border-purple-500/20 border-t-purple-600 rounded-full animate-spin"></div>
                <div className="absolute w-8 h-8 border-3 border-indigo-500/20 border-b-indigo-500 rounded-full animate-spin-reverse"></div>
            </div>
        </div>
    );
};

export const SkeletonCard = () => {
    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-4 shadow-sm animate-pulse">
            <div className="w-full h-48 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
            <div className="space-y-2">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
            </div>
            <div className="flex items-center gap-3 pt-2">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800"></div>
                <div className="flex-1 space-y-1">
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/6"></div>
                </div>
            </div>
        </div>
    );
};

export default Loader;
