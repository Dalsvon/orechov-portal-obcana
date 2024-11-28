import React, { useState, useEffect } from 'react';
import axiosInstance from '../services/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { isAdminState } from '../atoms/atoms';
import FolderCreator from '../forms/FolderCreator';
import Toast from '../notifications/Toast';
import { Folder, X, ChevronRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<string | null>(null);

  const fetchFolders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axiosInstance.get<FolderData[]>('/api/folders');
      setFolders(response.data);
    } catch (error) {
      console.error('Error fetching folders:', error);
      setError(`Nepodařilo se nahrát soubory. ${error instanceof Error ? error.message : String(error)}`);
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

  const handleDeleteFolder = (folderName: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFolderToDelete(folderName);
    setShowDeleteModal(true);
  };
  
  const handleConfirmDelete = async () => {
    if (!folderToDelete) return;
    
    try {
      await axiosInstance.delete(`/api/folders/${folderToDelete}`);
      showToast('Složka byla úspěšně smazána', 'success');
      fetchFolders();
    } catch (error) {
      console.error('Error deleting folder:', error);
      showToast('Složku se nepodařilo smazat. Možná není prázdná.', 'error');
    } finally {
      setShowDeleteModal(false);
      setFolderToDelete(null);
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
    <>
      <Helmet>
        <title>Formuláře a dokumenty | Portál občana obce Ořechov</title>
      </Helmet>
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

        <div className="bg-white rounded-lg shadow-md divide-y">
          {folders.map((folder) => (
            <div
              key={folder.name}
              onClick={() => handleFolderClick(folder.name)}
              className="group relative flex items-center p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
              role="button"
              tabIndex={0}
            >
              <div className="flex-shrink-0 mr-4">
                <Folder className="w-8 h-8 text-green-700" />
              </div>
              
              <div className="flex-grow min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {folder.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {folder.fileCount} {folder.fileCount === 1 ? 'soubor' : 
                   folder.fileCount >= 2 && folder.fileCount <= 4 ? 'soubory' : 
                   'souborů'}
                </p>
              </div>

              <div className="flex items-center gap-4">
                {isAdmin && folder.fileCount === 0 && (
                  <button
                    onClick={(e) => handleDeleteFolder(folder.name, e)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-all duration-200"
                    title="Smazat prázdnou složku"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
              </div>
            </div>
          ))}

          {folders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Zatím zde nejsou žádné složky.</p>
            </div>
          )}
        </div>

        {showDeleteModal && folderToDelete && (
          <DeleteConfirmationModal
            isOpen={showDeleteModal}
            onClose={() => {
              setShowDeleteModal(false);
              setFolderToDelete(null);
            }}
            onConfirm={handleConfirmDelete}
            itemName={folderToDelete}
            itemType="folder"
          />
        )}
      </div>
    </>
  );
};

export default Folders;