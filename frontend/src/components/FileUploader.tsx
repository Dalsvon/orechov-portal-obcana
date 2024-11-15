/*import React, { useState, useEffect } from 'react';
import axiosInstance from '../services/axiosInstance';
import Toast from '../notifications/Toast';

interface Toast {
  message: string;
  type: 'success' | 'error';
}

const FileUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [folder, setFolder] = useState('');
  const [folders, setFolders] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      const response = await axiosInstance.get('/api/folders');
      setFolders(response.data.map((folder: any) => folder.name));
      if (response.data.length > 0) {
        setFolder(response.data[0].name);
      }
    } catch (error) {
      console.error('Chyba při načítání složek:', error);
      showToast('Nepodařilo se načíst složky', 'error');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      // Set the file name as default name, removing the extension
      const nameWithoutExtension = selectedFile.name.replace(/\.[^/.]+$/, '');
      setName(nameWithoutExtension);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const handleUpload = async () => {
    if (!file || !name || !folder) {
      showToast('Prosím vyplňte název, vyberte soubor a složku', 'error');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('pdf', file);
      formData.append('name', name);
      formData.append('description', description);
      formData.append('folder', folder);

      await axiosInstance.post('/api/pdfs/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      showToast('Soubor byl úspěšně nahrán', 'success');
      
      // Reset form
      setFile(null);
      setName('');
      setDescription('');
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (error) {
      console.error('Chyba při nahrávání souboru:', error);
      showToast('Nepodařilo se nahrát soubor', 'error');
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

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Vybrat soubor
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            disabled={uploading}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            disabled={uploading}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Složka
          </label>
          <select
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            disabled={uploading}
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

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? 'Nahrávání...' : 'Nahrát soubor'}
        </button>
      </div>
    </div>
  );
};

export default FileUploader;*/

import React, { useState, useEffect } from 'react';
import axiosInstance from '../services/axiosInstance';
import Toast from '../notifications/Toast';

interface FileUploaderProps {
  defaultFolder?: string;
  hideFolder?: boolean;
  onUploadComplete?: () => void;
}

interface Toast {
  message: string;
  type: 'success' | 'error';
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
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    if (!hideFolder) {
      fetchFolders();
    }
  }, [hideFolder]);

  useEffect(() => {
    if (defaultFolder) {
      setFolder(defaultFolder);
    }
  }, [defaultFolder]);

  const fetchFolders = async () => {
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
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      // Set the file name as default name, removing the extension
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

  const handleUpload = async () => {
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

      await axiosInstance.post('/api/file/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      showToast('Soubor byl úspěšně nahrán', 'success');
      resetForm();
      
      if (onUploadComplete) {
        onUploadComplete();
      }
    } catch (error) {
      console.error('Chyba při nahrávání souboru:', error);
      showToast('Nepodařilo se nahrát soubor', 'error');
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

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Vybrat soubor
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            disabled={uploading}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? 'Nahrávání...' : 'Nahrát soubor'}
        </button>
      </div>
    </div>
  );
};

export default FileUploader;