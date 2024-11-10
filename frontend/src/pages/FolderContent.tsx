import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { isAdminState } from '../atoms/atoms';
import axiosInstance from '../services/axiosInstance';
import Movefile from '../components/Movefile';
import FileUploader from '../components/FileUploader';
import Toast from '../notifications/Toast';

interface PDF {
  id: string;
  name: string;
  description: string;
  folder: string;
  fileSize: number;
  fileType: string;
}

interface Toast {
  message: string;
  type: 'success' | 'error';
}

const FileDescription: React.FC<{ description: string | null }> = ({ description }) => {
  if (!description) return null;

  // Split into paragraphs and filter out empty ones
  const paragraphs = description.split(/\n\s*\n/).filter(p => p.trim());
  
  if (paragraphs.length <= 1) {
    // For single paragraphs, just preserve line breaks
    return (
      <p className="text-gray-600 mb-2 whitespace-pre-line">
        {description}
      </p>
    );
  }

  // For multiple paragraphs, create proper spacing
  return (
    <div className="text-gray-600 mb-2 space-y-4">
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="whitespace-pre-line">
          {paragraph}
        </p>
      ))}
    </div>
  );
};

const FolderContent: React.FC = () => {
  const { folderName } = useParams<{ folderName: string }>();
  const navigate = useNavigate();
  const isAdmin = useRecoilValue(isAdminState);
  const [files, setFiles] = useState<PDF[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<{id: string, name: string} | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);

  const fetchFolderContent = async () => {
    if (!folderName) return;
    
    try {
      setIsLoading(true);
      const response = await axiosInstance.get<{ name: string; files: PDF[] }[]>('/api/folders');
      const folder = response.data.find(f => f.name === decodeURIComponent(folderName));
      if (folder) {
        setFiles(folder.files || []);
      } else {
        setError('Složka nebyla nalezena');
      }
    } catch (error) {
      console.error('Error fetching folder content:', error);
      setError('Nepodařilo se načíst obsah složky');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleToast = (event: CustomEvent) => {
      showToast(event.detail.message, event.detail.type);
    };
  
    window.addEventListener('showToast', handleToast as EventListener);
    
    return () => {
      window.removeEventListener('showToast', handleToast as EventListener);
    };
  }, []);

  useEffect(() => {
    fetchFolderContent();
  }, [folderName]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

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
      showToast('Nepodařilo se stáhnout soubor', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Opravdu chcete tento soubor smazat?')) {
      try {
        await axiosInstance.delete(`/api/pdfs/${folderName}/${id}`);
        await fetchFolderContent();
        showToast('Soubor byl úspěšně smazán', 'success');
      } catch (error) {
        console.error('Error deleting file:', error);
        showToast('Nepodařilo se smazat soubor', 'error');
      }
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
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
        Chyba: {error}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="mb-6 flex items-center">
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm flex items-center transition-colors"
        >
          ← Zpět na složky
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold p-6 border-b">
          {decodeURIComponent(folderName || '')}
        </h2>

        {isAdmin && (
          <div className="p-6 border-b">
            <FileUploader 
              defaultFolder={folderName}
              hideFolder={true}
              onUploadComplete={fetchFolderContent}
            />
          </div>
        )}

        {files.length === 0 ? (
          <div className="text-center p-10 text-gray-500">
            Tato složka je prázdná
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
                  <FileDescription description={file.description} />
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span>Velikost: {formatFileSize(file.fileSize)}</span>
                    <span>Formát: {file.fileType.toUpperCase()}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload(file.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Stáhnout
                  </button>
                  
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => setSelectedFile({ id: file.id, name: file.name })}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                      >
                        Přesunout
                      </button>
                      <button
                        onClick={() => handleDelete(file.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                      >
                        Smazat
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