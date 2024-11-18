import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { isAdminState } from '../atoms/atoms';
import axiosInstance from '../services/axiosInstance';
import Toast from '../notifications/Toast';

interface FolderCreatorProps {
  onFolderCreated: (folderName: string) => void;
}

const FolderCreator: React.FC<FolderCreatorProps> = ({ onFolderCreated }) => {
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const isAdmin = useRecoilValue(isAdminState);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!newFolderName.trim()) {
      showToast('Prosím zadejte název složky', 'error');
      return;
    }

    setIsCreating(true);

    try {
      await axiosInstance.post('/api/folders', { folderName: newFolderName });
      setNewFolderName('');
      onFolderCreated(newFolderName);
    } catch (error: any) {
      console.error('Error adding folder:', error);
      const errorMessage = error.response?.data?.error || 'Nastala neočekávaná chyba';
      showToast(errorMessage, 'error');
    } finally {
      setIsCreating(false);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="mb-6">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex-grow">
          <label htmlFor="folderName" className="sr-only">
            Název nové složky
          </label>
          <input
            id="folderName"
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Název nové složky"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 
                     focus:outline-none focus:ring-2 focus:ring-green-500 
                     focus:border-transparent"
            disabled={isCreating}
            required
            minLength={1}
            maxLength={100}
            aria-label="Název nové složky"
          />
        </div>
        <button
          type="submit"
          disabled={isCreating}
          className="px-6 py-2 bg-green-700 text-white rounded-lg 
                   hover:bg-green-800 focus:outline-none focus:ring-2 
                   focus:ring-green-500 focus:ring-offset-2 
                   disabled:opacity-50 disabled:cursor-not-allowed 
                   transition-colors duration-200"
        >
          {isCreating ? 'Vytvářím...' : 'Vytvořit složku'}
        </button>
      </form>
    </div>
  );
};

export default FolderCreator;