import React, { useEffect, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { isAdminState } from './atoms/atoms';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import axiosInstance from './services/axiosInstance';
import Error404 from './pages/Error404';
import Folders from './pages/Folders';
import FolderContent from './pages/FolderContent';
import ErrorBoundary from './components/ErrorBoundry';
import { HelmetProvider } from 'react-helmet-async';
import PortalHome from './pages/HomePage';

const Contacts = React.lazy(() => import('./pages/Contacts'));
const AdminLogin = React.lazy(() => import('./forms/AdminLogin'));
const AdminPage = React.lazy(() => import('./pages/AdminPage'));

const LoadingFallback = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
  </div>
);

const App: React.FC = () => {
  const setIsAdmin = useSetRecoilState(isAdminState);

  useEffect(() => {
    // Check authentication status when app loads
    const checkAuth = async () => {
      try {
        const response = await axiosInstance.get('/api/auth/check-auth');
        setIsAdmin(response.data.isAuthenticated);
      } catch (error) {
        console.error('Auth check error:', error);
      }
    };
    
    checkAuth();
  }, [setIsAdmin]);

  return (
    <HelmetProvider>
      <ErrorBoundary>
        <div className="min-h-screen flex flex-col">
          <Header />
          
          <main className="flex-1 px-4 mb-16">
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={
                  <ProtectedRoute>
                    <AdminPage />
                  </ProtectedRoute>
                } />
                <Route path="/documents" element={<Folders />} />
                <Route path="/folder/:folderName" element={<FolderContent />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/" element={<PortalHome />} />
                <Route path="*" element={<Error404 />} />
              </Routes>
            </Suspense>
          </main>
  
          <Footer />
        </div>
      </ErrorBoundary>
    </HelmetProvider>
  );
};

export default App;