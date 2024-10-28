/*import React, { useState, useEffect } from 'react';
import axiosInstance from '../services/axiosInstance';

interface UploadResponse {
  message: string;
  id: string;
  uploadDate: number;
  fileType: string;
  fileSize: number;
  folder: string;
  name: string;
}

interface Folder {
  name: string;
  files: any[];
}

const PDFUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [folder, setFolder] = useState('');
  const [folders, setFolders] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadResponse | null>(null);

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      const response = await axiosInstance.get<Folder[]>('/api/folders');
      setFolders(response.data.map(folder => folder.name));
      if (response.data.length > 0) {
        setFolder(response.data[0].name);
      }
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !name || !description || !folder) {
      alert('Please fill in all fields, select a file, and choose a folder.');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('pdf', file);
      formData.append('name', name);
      formData.append('description', description);
      formData.append('folder', folder);

      const response = await axiosInstance.post<UploadResponse>('/api/pdfs/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload response:', response.data);
      setUploadedFile(response.data);
      alert('PDF uploaded successfully!');
      setFile(null);
      setName('');
      setDescription('');
    } catch (error) {
      console.error('Error uploading PDF:', error);
      alert('Failed to upload PDF. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h2>Upload PDF</h2>
      <div style={{ marginBottom: '10px' }}>
        <input type="file" onChange={handleFileChange} disabled={uploading} />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="PDF Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: '100%', padding: '5px' }}
          disabled={uploading}
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: '100%', padding: '5px' }}
          disabled={uploading}
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <select
          value={folder}
          onChange={(e) => setFolder(e.target.value)}
          style={{ width: '100%', padding: '5px' }}
          disabled={uploading}
        >
          <option value="">Select a folder</option>
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
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          padding: '10px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          width: '100%',
        }}
      >
        {uploading ? 'Uploading...' : 'Upload PDF'}
      </button>

      {uploadedFile && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
          <h3>Uploaded File Details:</h3>
          <p><strong>Name:</strong> {uploadedFile.name}</p>
          <p><strong>Folder:</strong> {uploadedFile.folder}</p>
          <p><strong>Upload Date:</strong> {new Date(uploadedFile.uploadDate).toLocaleString()}</p>
          <p><strong>File Type:</strong> {uploadedFile.fileType}</p>
          <p><strong>File Size:</strong> {uploadedFile.fileSize} bytes</p>
        </div>
      )}
    </div>
  );
};

export default PDFUploader;*/

import React, { useState, useEffect } from 'react';
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

export default FileUploader;