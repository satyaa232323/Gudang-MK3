import { useState, useEffect } from 'react'
import './App.css'
import AppRoutes from './routes/routes'
import ErrorBoundary from './components/ErrorBoundary'
import { initializeAuth } from './utils/authVerify'
import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [loading, setLoading] = useState(true);

  // Verify authentication token and add a brief loading delay
  useEffect(() => {
    const setup = async () => {
      try {
        // Verify the current auth token if it exists
        await initializeAuth();
      } catch (error) {
        console.error("Authentication initialization error:", error);
      } finally {
        // Add a brief delay for better UX
        setTimeout(() => {
          setLoading(false);
        }, 300);
      }
    };

    setup();
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f8f9fc'
      }}>
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        draggable
        theme="light"
      />
      <ErrorBoundary>
        <AppRoutes />
      </ErrorBoundary>
    </>
  )
}

export default App
