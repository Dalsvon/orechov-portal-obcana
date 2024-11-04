import React, { useState, useEffect } from 'react';
import axiosInstance from '../services/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { isAdminState } from '../atoms/atoms';
import FolderCreator from '../components/FolderCreator';
import Toast from '../notifications/Toast';

interface FolderData {
  name: string;
  files: any[];
}

interface Toast {
  message: string;
  type: 'success' | 'error';
}

const Folders: React.FC = () => {
  const [folders, setFolders] = useState<FolderData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const navigate = useNavigate();
  const isAdmin = useRecoilValue(isAdminState);

  const fetchFolders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axiosInstance.get<FolderData[]>('/api/folders');
      setFolders(response.data);
    } catch (error) {
      console.error('Error fetching folders:', error);
      setError(`Failed to load folders. ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  const handleDeleteFolder = async (folderName: string) => {
    try {
      await axiosInstance.delete(`/api/folders/${folderName}`);
      showToast('Složka byla úspěšně smazána', 'success');
      fetchFolders();
    } catch (error) {
      console.error('Error deleting folder:', error);
      showToast('Složku se nepodařilo smazat. Možná není prázdná.', 'error');
    }
  };

  const handleFolderClick = (folderName: string) => {
    navigate(`/folder/${encodeURIComponent(folderName)}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-800 p-4 rounded-lg mt-4">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        Dokumenty
      </h2>
      
      <div className="mb-8">
        <FolderCreator onFolderCreated={fetchFolders} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {folders.map((folder) => (
          <div
            key={folder.name}
            className="group relative bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
          >
            <button
              onClick={() => handleFolderClick(folder.name)}
              className="w-full h-full"
            >
              <div className="aspect-square p-6 flex flex-col items-center justify-center">
                <h3 className="text-xl font-semibold text-gray-800 text-center">
                  {folder.name}
                </h3>
                <p className="mt-2 text-gray-500 text-sm">
                  {folder.files.length} {folder.files.length === 1 ? 'soubor' : 
                   folder.files.length >= 2 && folder.files.length <= 4 ? 'soubory' : 
                   'souborů'}
                </p>
              </div>
            </button>

            {isAdmin && folder.files.length === 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteFolder(folder.name);
                }}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors duration-300"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>

      {folders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Zatím zde nejsou žádné složky.</p>
        </div>
      )}
    </div>
  );
};

export default Folders;