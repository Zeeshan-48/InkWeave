import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { useDispatch } from 'react-redux';
import blogService from './appwrite/database';
import conf from './appwrite/config';
import store from './redux/store';
import { addPost, updatePostInState, deletePostFromState } from './redux/blogSlice';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Subscribe to Appwrite Realtime channel for Blog posts collection
    const unsubscribe = blogService.client.subscribe(
      `databases.${conf.appwriteDatabaseId}.collections.${conf.appwriteCollectionId}.documents`,
      (response) => {
        const { events, payload } = response;
        
        if (events.some(e => e.includes('.create'))) {
          const currentPosts = store.getState().blogs.posts;
          if (!currentPosts.some(p => p.$id === payload.$id)) {
            dispatch(addPost(payload));
          }
        } else if (events.some(e => e.includes('.update'))) {
          dispatch(updatePostInState(payload));
        } else if (events.some(e => e.includes('.delete'))) {
          dispatch(deletePostFromState(payload.$id));
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, [dispatch]);

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
        
        {/* Navigation Bar */}
        <Navbar />

        {/* Core Layout Content */}
        <main className="flex-1">
          <AppRoutes />
        </main>

        {/* Sticky Footer */}
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
