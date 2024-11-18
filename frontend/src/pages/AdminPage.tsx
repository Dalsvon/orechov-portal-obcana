import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { isAdminState } from '../atoms/atoms';
import axiosInstance from '../services/axiosInstance';
import FileUploader from '../forms/FileUploader';
import { Helmet } from 'react-helmet-async';

const AdminPage = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const setIsAdmin = useSetRecoilState(isAdminState);
  const navigate = useNavigate();

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Nová hesla se neshodují');
      return;
    }

    try {
      await axiosInstance.post('/api/auth/change-password', {
        currentPassword,
        newPassword
      });
      setSuccess('Heslo bylo úspěšně změněno');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setError(error.response?.data?.error || 'Chyba při změně hesla');
    }
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/api/auth/logout');
      setIsAdmin(false);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Administrace | Portál občana obce Ořechov</title>
      </Helmet>
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid md:grid-cols-2 gap-8">
          {/* PDF Uploader Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Nahrát dokument</h2>
            <FileUploader onUploadComplete={() => {}} />
          </div>
          <div className="space-y-8">
            {/* Password Change Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6">Změnit heslo</h2>
              <form onSubmit={handlePasswordChange} className="space-y-4">
              <input 
                type="text" 
                autoComplete="username" 
                value="admin"
                aria-hidden="true"
                style={{ display: 'none' }}
                readOnly
              />
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Současné heslo
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                    autoComplete="current-password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nové heslo
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                    autoComplete="new-password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Potvrdit nové heslo
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                    autoComplete="new-password"
                  />
                </div>
                {error && (
                  <div className="text-red-600 text-sm">{error}</div>
                )}
                {success && (
                  <div className="text-green-600 text-sm">{success}</div>
                )}
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Změnit heslo
                </button>
              </form>
            </div>

            {/* Logout Button */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6">Odhlášení</h2>
              <button
                onClick={handleLogout}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Odhlásit se
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPage;