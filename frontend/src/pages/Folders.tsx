import React, { useState, useEffect } from 'react';
import axiosInstance from '../services/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { isAdminState } from '../atoms/atoms';
import FolderCreator from '../forms/FolderCreator';
import Toast from '../notifications/Toast';
import { X } from 'lucide-react';

interface FolderData {
  name: string;
  fileCount: number;
}

const Folders: React.FC = () => {
  const [folders, setFolders] = useState<FolderData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{message: string; type: 'success' | 'error'} | null>(null);
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

  const handleDeleteFolder = async (folderName: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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

  const onFolderCreated = (folderName: string) => {
    fetchFolders();
    showToast(`Složka ${folderName} byla úspěšně vytvořena`, 'success');
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
        Formuláře a dokumenty
      </h2>
      
      <div className="mb-8">
        <FolderCreator onFolderCreated={onFolderCreated} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {folders.map((folder) => (
      <div
        key={folder.name}
        className="group relative bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
        onClick={() => handleFolderClick(folder.name)}
        role="button"
        tabIndex={0}
      >
        <div className="block md:hidden p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0 pr-2">
              <h3 className="text-lg font-semibold text-gray-800 break-words">
                {folder.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {folder.fileCount} {folder.fileCount === 1 ? 'soubor' : 
                 folder.fileCount >= 2 && folder.fileCount <= 4 ? 'soubory' : 
                 'souborů'}
              </p>
            </div>
            {isAdmin && folder.fileCount === 0 && (
              <div 
                onClick={(e) => handleDeleteFolder(folder.name, e)}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 
                         rounded-full transition-colors duration-300 flex-shrink-0 cursor-pointer"
                title="Smazat prázdnou složku"
                role="button"
                tabIndex={0}
              >
                <X size={20} />
              </div>
            )}
          </div>
        </div>

        <div className="hidden md:block aspect-square">
          <div className="w-full h-full flex flex-col items-center justify-center p-6">
            <div className="text-center w-full">
              <h3 className="text-xl font-semibold text-gray-800 break-words">
                {folder.name}
              </h3>
              <p className="mt-2 text-gray-500 text-sm">
                {folder.fileCount} {folder.fileCount === 1 ? 'soubor' : 
                folder.fileCount >= 2 && folder.fileCount <= 4 ? 'soubory' : 
                'souborů'}
              </p>
            </div>
          </div>
        </div>

        {isAdmin && folder.fileCount === 0 && (
          <div
            onClick={(e) => handleDeleteFolder(folder.name, e)}
            className="hidden md:block absolute top-2 right-2 text-red-500 
                     hover:text-red-700 p-2 rounded-full hover:bg-red-50 
                     transition-colors duration-300 cursor-pointer"
            title="Smazat prázdnou složku"
            role="button"
            tabIndex={0}
          >
            <X size={20} />
          </div>
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