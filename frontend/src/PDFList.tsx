import React, { useState, useEffect } from 'react';
import axiosInstance from './services/axiosInstance';
import FolderCreator from './components/FolderCreator'; // Import the FolderCreator component

interface PDF {
  id: string;
  name: string;
  description: string;
  folder: string;
}

interface Folder {
  name: string;
  files: PDF[];
}

const PDFList: React.FC = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFolders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axiosInstance.get<Folder[]>('/api/folders');
      console.log('Received folders:', response.data);
      setFolders(response.data);
    } catch (error) {
      console.error('Error fetching folders:', error);
      setError(`Failed to load folders. ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  const handleDownload = async (folder: string, id: string) => {
    try {
      console.log('Fetching download URL for PDF:', id, 'in folder:', folder);
      const response = await axiosInstance.get<{ downloadUrl: string }>(`/api/pdfs/${folder}/${id}/download`);
      console.log('Download data:', response.data);
      
      if (!response.data.downloadUrl) {
        throw new Error('No download URL provided');
      }
      
      window.open(response.data.downloadUrl, '_blank');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert(`Failed to download PDF. ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleDelete = async (folder: string, id: string) => {
    try {
      console.log('Deleting PDF:', id, 'from folder:', folder);
      await axiosInstance.delete(`/api/pdfs/${folder}/${id}`);
      console.log('PDF deleted successfully');
      fetchFolders();
    } catch (error) {
      console.error('Error deleting PDF:', error);
      alert('Failed to delete PDF. Please try again.');
    }
  };

  const handleDeleteFolder = async (folderName: string) => {
    try {
      await axiosInstance.delete(`/api/folders/${folderName}`);
      alert('Folder deleted successfully');
      fetchFolders();
    } catch (error) {
      console.error('Error deleting folder:', error);
      alert('Failed to delete folder. It might not be empty.');
    }
  };

  if (isLoading) {
    return <div>Loading folders and PDFs...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={{ marginTop: '20px' }}>
      <h2>PDF Documents by Folder</h2>
      
      <FolderCreator onFolderCreated={fetchFolders} />
      
      {folders.length === 0 ? (
        <p>No folders available.</p>
      ) : (
        folders.map((folder) => (
          <div key={folder.name} style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>
              {folder.name}
              {folder.files.length === 0 && (
                <button
                  onClick={() => handleDeleteFolder(folder.name)}
                  style={{
                    backgroundColor: '#dc3545',
                    color: 'white',
                    padding: '5px 10px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginLeft: '10px',
                    fontSize: '14px'
                  }}
                >
                  Delete Folder
                </button>
              )}
            </h3>
            {folder.files.length === 0 ? (
              <p>This folder is empty.</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {folder.files.map((pdf) => (
                  <li key={pdf.id} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
                    <h4 style={{ fontSize: '18px', marginBottom: '5px' }}>{pdf.name}</h4>
                    <p style={{ color: '#666', marginBottom: '10px' }}>{pdf.description}</p>
                    <button
                      onClick={() => handleDownload(folder.name, pdf.id)}
                      style={{
                        backgroundColor: '#007bff',
                        color: 'white',
                        padding: '8px 16px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginRight: '10px'
                      }}
                    >
                      Download
                    </button>
                    <button
                      onClick={() => handleDelete(folder.name, pdf.id)}
                      style={{
                        backgroundColor: '#dc3545',
                        color: 'white',
                        padding: '8px 16px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default PDFList;