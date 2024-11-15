import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { isAdminState } from '../atoms/atoms';
import axiosInstance from '../services/axiosInstance';
import Movefile from '../components/Movefile';
import FileUploader from '../components/FileUploader';
import Toast from '../notifications/Toast';
import { Plus, X } from 'lucide-react';

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

const FolderContent: React.FC = () => {
  const { folderName } = useParams<{ folderName: string }>();
  const navigate = useNavigate();
  const isAdmin = useRecoilValue(isAdminState);
  const [files, setFiles] = useState<PDF[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<{id: string, name: string} | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const [showUploader, setShowUploader] = useState(false);

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
      const response = await axiosInstance.get(`/api/file/${folderName}/${id}/download`, {
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
        await axiosInstance.delete(`/api/file/${folderName}/${id}`);
        await fetchFolderContent();
        showToast('Soubor byl úspěšně smazán', 'success');
      } catch (error) {
        console.error('Error deleting file:', error);
        showToast('Nepodařilo se smazat soubor', 'error');
      }
    }
  };

  const handleUploadComplete = () => {
    fetchFolderContent();
    setShowUploader(false);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDescription = (description: string) => {
    return description.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < description.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
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
        <h2 className="text-2xl font-bold p-6 border-b break-words">
          {decodeURIComponent(folderName || '')}
        </h2>

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
                  <h3 className="text-lg font-semibold mb-2 break-words">
                    {file.name}
                  </h3>
                  {file.description && (
                    <p className="text-gray-600 mb-2 whitespace-pre-line break-words">
                      {formatDescription(file.description)}
                    </p>
                  )}
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span>Velikost: {formatFileSize(file.fileSize)}</span>
                    <span>Typ: {file.fileType.toUpperCase()}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
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

        {isAdmin && !showUploader && (
          <div className="p-6 border-t flex justify-center">
            <button
              onClick={() => setShowUploader(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Plus size={20} />
              Přidat soubor
            </button>
          </div>
        )}

        {isAdmin && showUploader && (
          <div className="p-6 border-t">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Přidat nový soubor</h3>
              <button
                onClick={() => setShowUploader(false)}
                className="flex items-center gap-2 px-3 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
                title="Zrušit přidávání"
              >
                <X size={20} />
                Zrušit
              </button>
            </div>
            <FileUploader 
              defaultFolder={folderName}
              hideFolder={true}
              onUploadComplete={handleUploadComplete}
            />
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