import mimeTypes from 'mime-types';

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
    return encodeURIComponent(fileName)
      .replace(/['()]/g, escape)
      .replace(/\*/g, '_');
  };