import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { isAdminState } from './atoms/atoms';
import Header from './components/Header';
import Footer from './components/Footer';
import Folders from './pages/Folders';
import FolderContent from './pages/FolderContent';
import Contacts from './pages/Contacts';
import AdminLogin from './components/AdminLogin';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './components/ProtectedRoute';
import axiosInstance from './services/axiosInstance';

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
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 px-4 mb-16">
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Folders />} />
          <Route path="/folder/:folderName" element={<FolderContent />} />
          <Route path="/contacts" element={<Contacts />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;