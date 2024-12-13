import mimeTypes from 'mime-types';
import { FolderFile, FormattedFolderFile } from '../types/fileTypes';
import { FolderWithFileIds } from '../types/folderTypes';

export const FILE_NAME_MAX_LENGTH = 100;

// Returns short mimetype for file
export const getShortFileType = (mimeType: string, originalFilename: string): string => {
    // First try to get extension from mime type
    let extension = mimeTypes.extension(mimeType);
    
    // If that fails, try to get extension from filename
    if (!extension) {
        const filenameParts = originalFilename.split('.');
        if (filenameParts.length > 1) {
        const extractedExtension = filenameParts.pop();
        if (extractedExtension) {
            extension = extractedExtension.toLowerCase();
        }
      }
    }
  
  if (!extension) {
    extension = mimeType.split('/')[1] || mimeType.split('/')[0];
  }
  
  return extension.toString();
};

// Formats date for frontend
export const formatDate = (date: Date): string => {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
};

// Prepares and sanitizes file name to be used for download of the file
export const sanitizeFileName = (fileName: string): string => {
  // Since extension is stored separately, we just sanitize the name
  return fileName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9\-]/g, '') // This will also remove dots
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const formatFolderFile = (files: FolderFile[], folderName: string): FormattedFolderFile[] => {
  return files.map(file => ({
    id: file.id,
    name: file.name,
    description: file.description,
    fileType: file.fileType,
    fileSize: file.fileSize,
    folder: folderName,
    fromWebsite: file.fromWebsite
  }));
};

export const doesFileExistInFolder = (folder: FolderWithFileIds, fileId: string): boolean => {
  return folder.files.some(file => file.id === fileId);
};

// Checks length of a name
export const checkLength = (name: string): boolean => {
  return name.length > FILE_NAME_MAX_LENGTH;
}