/*import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';
import Movefile from '../components/Movefile';

interface PDF {
  id: string;
  name: string;
  description: string;
  folder: string;
  uploadDate: string;
  fileSize: number;
  fileType: string;
}

const FolderContent: React.FC = () => {
  const { folderName } = useParams<{ folderName: string }>();
  const navigate = useNavigate();
  const [files, setFiles] = useState<PDF[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<{id: string, name: string} | null>(null);

  const fetchFolderContent = async () => {
    if (!folderName) return;
    
    try {
      setIsLoading(true);
      const response = await axiosInstance.get<{ name: string; files: PDF[] }[]>('/api/folders');
      const folder = response.data.find(f => f.name === decodeURIComponent(folderName));
      if (folder) {
        setFiles(folder.files || []);
      } else {
        setError('Folder not found');
      }
    } catch (error) {
      console.error('Error fetching folder content:', error);
      setError(`Failed to load folder content. ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFolderContent();
  }, [folderName]);

  const handleDownload = async (id: string) => {
    try {
      // Make the request with responseType blob
      const response = await axiosInstance.get(`/api/pdfs/${folderName}/${id}/download`, {
        responseType: 'blob'
      });
  
      // Create a blob URL
      const blob = new Blob([response.data], { 
        type: response.headers['content-type'] 
      });
      const url = window.URL.createObjectURL(blob);
  
      // Create a temporary link and click it
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', response.headers['content-disposition']
        ? response.headers['content-disposition'].split('filename=')[1].replace(/"/g, '')
        : 'download');
      document.body.appendChild(link);
      link.click();
      link.remove();
  
      // Clean up the blob URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      try {
        await axiosInstance.delete(`/api/pdfs/${folderName}/${id}`);
        await fetchFolderContent();
      } catch (error) {
        console.error('Error deleting PDF:', error);
        alert('Failed to delete PDF. Please try again.');
      }
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px' 
      }}>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: '20px', 
        color: '#dc2626', 
        backgroundColor: '#fee2e2', 
        borderRadius: '4px',
        margin: '20px'
      }}>
        Error: {error}
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '8px 16px',
            backgroundColor: '#f3f4f6',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          ← Back to Folders
        </button>
      </div>

      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        padding: '20px'
      }}>
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold',
          marginBottom: '20px',
          padding: '0 20px'
        }}>
          {decodeURIComponent(folderName || '')}
        </h2>

        {files.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            color: '#6b7280' 
          }}>
            This folder is empty
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {files.map((file) => (
              <div
                key={file.id}
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '16px',
                  backgroundColor: 'white'
                }}
              >
                <div style={{ marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                    {file.name}
                  </h3>
                  <p style={{ color: '#6b7280', marginBottom: '8px' }}>
                    {file.description}
                  </p>
                  <div style={{ 
                    display: 'flex', 
                    gap: '16px', 
                    fontSize: '14px', 
                    color: '#6b7280' 
                  }}>
                    <span>Size: {formatFileSize(file.fileSize)}</span>
                    <span>Type: {file.fileType.toUpperCase()}</span>
                    <span>Uploaded: {file.uploadDate}</span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleDownload(file.id)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#2563eb',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Download
                  </button>
                  <button
                    onClick={() => setSelectedFile({ id: file.id, name: file.name })}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#6b7280',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Move
                  </button>
                  <button
                    onClick={() => handleDelete(file.id)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#dc2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedFile && (
        <Movefile
          fileId={selectedFile.id}
          fileName={selectedFile.name}
          currentFolder={folderName!}
          onClose={() => setSelectedFile(null)}
        />
      )}
    </div>
  );
};

export default FolderContent;*/

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { isAdminState } from '../atoms/atoms';
import axiosInstance from '../services/axiosInstance';
import Movefile from '../components/Movefile';

interface PDF {
  id: string;
  name: string;
  description: string;
  folder: string;
  fileSize: number;
  fileType: string;
}

const FolderContent: React.FC = () => {
  const { folderName } = useParams<{ folderName: string }>();
  const navigate = useNavigate();
  const isAdmin = useRecoilValue(isAdminState);
  const [files, setFiles] = useState<PDF[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<{id: string, name: string} | null>(null);

  const fetchFolderContent = async () => {
    if (!folderName) return;
    
    try {
      setIsLoading(true);
      const response = await axiosInstance.get<{ name: string; files: PDF[] }[]>('/api/folders');
      const folder = response.data.find(f => f.name === decodeURIComponent(folderName));
      if (folder) {
        setFiles(folder.files || []);
      } else {
        setError('Folder not found');
      }
    } catch (error) {
      console.error('Error fetching folder content:', error);
      setError(`Failed to load folder content. ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFolderContent();
  }, [folderName]);

  const handleDownload = async (id: string) => {
    try {
      const response = await axiosInstance.get(`/api/pdfs/${folderName}/${id}/download`, {
        responseType: 'blob'
      });
  
      const blob = new Blob([response.data], { 
        type: response.headers['content-type'] 
      });
      const url = window.URL.createObjectURL(blob);
  
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', response.headers['content-disposition']
        ? response.headers['content-disposition'].split('filename=')[1].replace(/"/g, '')
        : 'download');
      document.body.appendChild(link);
      link.click();
      link.remove();
  
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      try {
        await axiosInstance.delete(`/api/pdfs/${folderName}/${id}`);
        await fetchFolderContent();
      } catch (error) {
        console.error('Error deleting PDF:', error);
        alert('Failed to delete PDF. Please try again.');
      }
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 mx-4 text-red-700 bg-red-100 rounded-md">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6 flex items-center">
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm flex items-center transition-colors"
        >
          ← Back to Folders
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold p-6 border-b">
          {decodeURIComponent(folderName || '')}
        </h2>

        {files.length === 0 ? (
          <div className="text-center p-10 text-gray-500">
            This folder is empty
          </div>
        ) : (
          <div className="divide-y">
            {files.map((file) => (
              <div
                key={file.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">
                    {file.name}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    {file.description}
                  </p>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span>Size: {formatFileSize(file.fileSize)}</span>
                    <span>Type: {file.fileType.toUpperCase()}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload(file.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Download
                  </button>
                  
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => setSelectedFile({ id: file.id, name: file.name })}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                      >
                        Move
                      </button>
                      <button
                        onClick={() => handleDelete(file.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedFile && (
        <Movefile
          fileId={selectedFile.id}
          fileName={selectedFile.name}
          currentFolder={folderName!}
          onClose={() => setSelectedFile(null)}
        />
      )}
    </div>
  );
};

export default FolderContent;