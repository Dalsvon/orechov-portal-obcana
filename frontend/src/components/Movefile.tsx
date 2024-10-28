import React, { useState, useEffect } from 'react';
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

export default Movefile;