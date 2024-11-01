/*import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';

interface MoveFileProps {
  fileId: string;
  currentFolder: string;
  fileName: string;
  onClose: () => void;
}

const Movefile: React.FC<MoveFileProps> = ({ 
  fileId, 
  currentFolder,
  fileName, 
  onClose 
}) => {
  const [folders, setFolders] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get('/api/folders');
      // Filter out the current folder and extract folder names
      const folderNames = response.data
        .map((folder: { name: string }) => folder.name)
        .filter((name: string) => name !== currentFolder);
      setFolders(folderNames);
    } catch (error) {
      console.error('Error fetching folders:', error);
      setError('Failed to load folders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMove = async (targetFolder: string) => {
    try {
      await axiosInstance.post('/api/files/move', {
        fileId,
        sourceFolder: currentFolder,
        targetFolder
      });
      alert('File moved successfully');
      // Navigate to the new folder location
      navigate(`/folder/${encodeURIComponent(targetFolder)}`);
    } catch (error) {
      console.error('Error moving file:', error);
      alert('Failed to move file');
    }
  };

  if (isLoading) {
    return <div>Loading folders...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        minWidth: '300px',
        maxWidth: '500px',
        width: '90%'
      }}>
        <h2 style={{ marginBottom: '20px' }}>Move "{fileName}"</h2>
        <p style={{ marginBottom: '20px' }}>Select destination folder:</p>
        
        {folders.length === 0 ? (
          <p>No other folders available</p>
        ) : (
          <ul style={{ 
            listStyle: 'none', 
            padding: 0,
            maxHeight: '300px',
            overflowY: 'auto'
          }}>
            {folders.map((folder) => (
              <li 
                key={folder}
                style={{
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  marginBottom: '8px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onClick={() => handleMove(folder)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0f0f0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {folder}
              </li>
            ))}
          </ul>
        )}
        
        <div style={{
          marginTop: '20px',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Movefile;*/

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';
import { X } from 'lucide-react';

interface MoveFileProps {
  fileId: string;
  currentFolder: string;
  fileName: string;
  onClose: () => void;
}

const Movefile: React.FC<MoveFileProps> = ({ 
  fileId, 
  currentFolder,
  fileName, 
  onClose 
}) => {
  const [folders, setFolders] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get('/api/folders');
      const folderNames = response.data
        .map((folder: { name: string }) => folder.name)
        .filter((name: string) => name !== currentFolder);
      setFolders(folderNames);
    } catch (error) {
      console.error('Error fetching folders:', error);
      setError('Nepodařilo se načíst složky');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMove = async (targetFolder: string) => {
    try {
      await axiosInstance.post('/api/files/move', {
        fileId,
        sourceFolder: currentFolder,
        targetFolder
      });
      onClose();
      navigate(`/folder/${encodeURIComponent(targetFolder)}`);
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('showToast', { 
          detail: { 
            message: 'Soubor byl úspěšně přesunut', 
            type: 'success' 
          }
        }));
      }, 100);
    } catch (error) {
      console.error('Error moving file:', error);
      setError('Nepodařilo se přesunout soubor');
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Přesunout soubor</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 rounded-full p-2
                     hover:bg-gray-100 active:bg-gray-200
                     transition-colors duration-150
                     focus:outline-none"
            type="button"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <p className="text-gray-600">
              Vyberte cílovou složku pro soubor:
            </p>
            <p className="mt-2 text-gray-900 font-medium break-words">
              "{fileName}"
            </p>
          </div>

          {error ? (
            <div className="text-red-600 p-4 bg-red-50 rounded-md">
              {error}
            </div>
          ) : folders.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              Nejsou dostupné žádné další složky
            </p>
          ) : (
            <div className="max-h-[300px] overflow-y-auto">
              <div className="space-y-2">
                {folders.map((folder) => (
                  <button
                    key={folder}
                    onClick={() => handleMove(folder)}
                    className="w-full text-left px-4 py-3 rounded-md
                             bg-white hover:bg-gray-50 active:bg-gray-100
                             border border-gray-200
                             transition-all duration-150 ease-in-out
                             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500
                             active:scale-[0.99]
                             disabled:opacity-50 disabled:cursor-not-allowed"
                    type="button"
                  >
                    {folder}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md
                       bg-white text-gray-700
                       hover:bg-gray-100 active:bg-gray-200
                       transition-all duration-150 ease-in-out
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400
                       active:scale-[0.98]"
              type="button"
            >
              Zrušit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Movefile;