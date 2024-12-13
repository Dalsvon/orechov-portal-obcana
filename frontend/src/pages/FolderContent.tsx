import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { isAdminState } from '../atoms/atoms';
import axiosInstance from '../services/axiosInstance';
import Movefile from '../components/FileMove';
import FileUploader from '../forms/FileUploader';
import Toast from '../notifications/Toast';
import { ArrowLeft, Download, Globe, Move, Plus, Trash2, X } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

interface File {
  id: string;
  name: string;
  description: string;
  folder: string;
  fileSize: number;
  fileType: string;
  fromWebsite: boolean;
}

const FolderContent: React.FC = () => {
  const { folderName } = useParams<{ folderName: string }>();
  const navigate = useNavigate();
  const isAdmin = useRecoilValue(isAdminState);
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<{id: string, name: string} | null>(null);
  const [toast, setToast] = useState<{message: string; type: 'success' | 'error'} | null>(null);
  const [showUploader, setShowUploader] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{id: string, name: string} | null>(null);

  const fetchFolderContent = useCallback(async () => {
    if (!folderName) return;
    
    try {
      setIsLoading(true);
      const response = await axiosInstance.get<File[]>(
        `/api/folders/${encodeURIComponent(folderName)}/files`
      );
      const sortedFiles = response.data.sort((a, b) => 
        a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
      );
      setFiles(sortedFiles);
    } catch (error) {
      console.error('Error fetching folder content:', error);
      setError('Nepodařilo se načíst obsah složky');
    } finally {
      setIsLoading(false);
    }
  }, [folderName]);
  
  useEffect(() => {
    fetchFolderContent();
  }, [fetchFolderContent]);

  useEffect(() => {
    const handleToast = (event: CustomEvent) => {
      showToast(event.detail.message, event.detail.type);
    };
  
    window.addEventListener('showToast', handleToast as EventListener);
    
    return () => {
      window.removeEventListener('showToast', handleToast as EventListener);
    };
  }, []);

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

  const handleDelete = (id: string, name: string) => {
    setItemToDelete({ id, name });
    setShowDeleteModal(true);
  };
  
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    
    try {
      await axiosInstance.delete(`/api/file/${folderName}/${itemToDelete.id}`);
      await fetchFolderContent();
      showToast('Soubor byl úspěšně smazán', 'success');
    } catch (error) {
      console.error('Error deleting file:', error);
      showToast('Nepodařilo se smazat soubor', 'error');
    } finally {
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  const handleUploadComplete = (fileName: string) => {
    fetchFolderContent();
    setShowUploader(false);
    showToast(`Soubor ${fileName} byl úspěšně nahrán`, 'success');
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
    <>
      <Helmet>
        <title>{decodeURIComponent(folderName || '')} | Portál občana obce Ořechov</title>
      </Helmet>
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
            onClick={() => navigate('/documents')}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Zpět na Formuláře a dokumenty
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold p-6 border-b break-words">
            {decodeURIComponent(folderName || '')}
          </h2>

          {files.length === 0 ? (
            <div className="text-center p-10 text-gray-500">
              Tato složka je prázdná
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="mb-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-semibold mb-2 break-words">
                        {file.name}
                      </h3>
                      {isAdmin && file.fromWebsite && (
                        <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                          <Globe className="w-3 h-3" />
                          Z webové stránky obce
                        </div>
                      )}
                    </div>
                    {file.description && (
                      <p className="text-gray-600 mb-2 whitespace-pre-line break-words">
                        {formatDescription(file.description)}
                      </p>
                    )}
                    <div className="flex gap-4 text-sm text-gray-500">
                      <span>Velikost: {formatFileSize(file.fileSize)}</span>
                      <span>Formát: {"." + file.fileType}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleDownload(file.id)}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all shadow-sm"
                    >
                      <Download className="w-4 h-4" />
                      Stáhnout
                    </button>
                    
                    {isAdmin && (
                      <>
                        <button
                          onClick={() => setSelectedFile({ id: file.id, name: file.name })}
                          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all shadow-sm"
                        >
                          <Move className="w-4 h-4" />
                          Přesunout
                        </button>
                        <button
                          onClick={() => handleDelete(file.id, file.name)}
                          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all shadow-sm"
                        >
                          <Trash2 className="w-4 h-4" />
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
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all shadow-sm"
              >
                <Plus className="w-5 h-5" />
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
                  className="inline-flex items-center gap-2 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all"
                  title="Zrušit přidávání"
                >
                  <X className="w-5 h-5" />
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

        {showDeleteModal && itemToDelete && (
          <DeleteConfirmationModal
            isOpen={showDeleteModal}
            onClose={() => {
              setShowDeleteModal(false);
              setItemToDelete(null);
            }}
            onConfirm={handleConfirmDelete}
            itemName={itemToDelete.name}
            itemType="file"
          />
        )}
      </div>
    </>
  );
};

export default FolderContent;

