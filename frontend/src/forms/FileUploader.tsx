import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../services/axiosInstance';
import Toast from '../notifications/Toast';

interface FileUploaderProps {
  defaultFolder?: string;
  hideFolder?: boolean;
  onUploadComplete?: (fileName: string) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ 
  defaultFolder,
  hideFolder = false,
  onUploadComplete
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [folder, setFolder] = useState(defaultFolder || '');
  const [folders, setFolders] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{message: string; type: 'success' | 'error'} | null>(null);

  const fetchFolders = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/api/folders');
      setFolders(response.data.map((folder: any) => folder.name));
      if (!defaultFolder && response.data.length > 0) {
        setFolder(response.data[0].name);
      }
    } catch (error) {
      console.error('Chyba při načítání složek:', error);
      showToast('Nepodařilo se načíst složky', 'error');
    }
  }, [defaultFolder]);

  useEffect(() => {
    if (!hideFolder) {
      fetchFolders();
    }
  }, [hideFolder, fetchFolders]);

  useEffect(() => {
    if (defaultFolder) {
      setFolder(defaultFolder);
    }
  }, [defaultFolder]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      const nameWithoutExtension = selectedFile.name.replace(/\.[^/.]+$/, '');
      setName(nameWithoutExtension);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const resetForm = () => {
    setFile(null);
    setName('');
    setDescription('');
    if (!defaultFolder) {
      setFolder('');
    }
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !name || !folder) {
      showToast('Prosím vyplňte název, vyberte soubor a složku', 'error');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', name);
      formData.append('description', description);
      formData.append('folder', folder);

      const response = await axiosInstance.post('/api/file/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      showToast(`Soubor ${response.data.name} byl úspěšně nahrán`, 'success');

      resetForm();
      
      if (onUploadComplete) {
        onUploadComplete(response.data.name);
      }
    } catch (error: any) {
      console.error('Chyba při nahrávání souboru:', error);
      showToast(error.response?.data?.message || 'Nepodařilo se nahrát soubor', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Vybrat soubor
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            disabled={uploading}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 
                     file:px-4 file:rounded-md file:border-0 file:text-sm 
                     file:font-semibold file:bg-indigo-50 file:text-indigo-700 
                     hover:file:bg-indigo-100"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Název
          </label>
          <input
            type="text"
            placeholder="Zadejte název souboru"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md 
                     shadow-sm focus:outline-none focus:ring-indigo-500 
                     focus:border-indigo-500"
            disabled={uploading}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Popis (volitelné)
          </label>
          <textarea
            placeholder="Zadejte popis souboru"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md 
                     shadow-sm focus:outline-none focus:ring-indigo-500 
                     focus:border-indigo-500"
            disabled={uploading}
            rows={3}
          />
        </div>

        {!hideFolder && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Složka
            </label>
            <select
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md 
                       shadow-sm focus:outline-none focus:ring-indigo-500 
                       focus:border-indigo-500"
              disabled={uploading || !!defaultFolder}
              required
            >
              <option value="">Vyberte složku</option>
              {folders.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          type="submit"
          disabled={uploading || !file}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md 
                   hover:bg-indigo-700 focus:outline-none focus:ring-2 
                   focus:ring-indigo-500 focus:ring-offset-2 
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors duration-200"
        >
          {uploading ? 'Nahrávání...' : 'Nahrát soubor'}
        </button>
      </form>
    </div>
  );
};

export default FileUploader;