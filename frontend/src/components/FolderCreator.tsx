/*import React, { useState } from 'react';
import axiosInstance from '../services/axiosInstance';

interface FolderCreatorProps {
  onFolderCreated: () => void;
}

const FolderCreator: React.FC<FolderCreatorProps> = ({ onFolderCreated }) => {
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleAddFolder = async () => {
    if (!newFolderName.trim()) {
      alert('Please enter a folder name');
      return;
    }

    setIsCreating(true);

    try {
      await axiosInstance.post('/api/folders', { folderName: newFolderName });
      setNewFolderName('');
      onFolderCreated();
      alert('Folder created successfully!');
    } catch (error) {
      console.error('Error adding folder:', error);
      alert('Failed to add folder. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <input
        type="text"
        value={newFolderName}
        onChange={(e) => setNewFolderName(e.target.value)}
        placeholder="New folder name"
        style={{ padding: '5px', marginRight: '10px' }}
        disabled={isCreating}
      />
      <button
        onClick={handleAddFolder}
        disabled={isCreating}
        style={{
          backgroundColor: '#4CAF50',
          color: 'white',
          padding: '8px 16px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        {isCreating ? 'Creating...' : 'Add Folder'}
      </button>
    </div>
  );
};

export default FolderCreator;*/

import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { isAdminState } from '../atoms/atoms';
import axiosInstance from '../services/axiosInstance';
import Toast from '../notifications/Toast';

interface FolderCreatorProps {
  onFolderCreated: () => void;
}

interface Toast {
  message: string;
  type: 'success' | 'error';
}

const FolderCreator: React.FC<FolderCreatorProps> = ({ onFolderCreated }) => {
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const isAdmin = useRecoilValue(isAdminState);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const handleAddFolder = async () => {
    if (!newFolderName.trim()) {
      showToast('Prosím zadejte název složky', 'error');
      return;
    }

    setIsCreating(true);

    try {
      await axiosInstance.post('/api/folders', { folderName: newFolderName });
      setNewFolderName('');
      onFolderCreated();
      showToast('Složka byla úspěšně vytvořena', 'success');
    } catch (error) {
      console.error('Error adding folder:', error);
      showToast('Nepodařilo se vytvořit složku. Prosím zkuste to znovu.', 'error');
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
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-grow">
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Název nové složky"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            disabled={isCreating}
          />
        </div>
        <button
          onClick={handleAddFolder}
          disabled={isCreating}
          className="px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isCreating ? 'Vytvářím...' : 'Vytvořit složku'}
        </button>
      </div>
    </div>
  );
};

export default FolderCreator;