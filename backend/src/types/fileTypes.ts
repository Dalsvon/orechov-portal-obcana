  export interface File {
    id: string;
    name: string;
    description: string | null;
    content: Buffer;
    mimeType: string;
    fileType: string;
    fileSize: number;
    uploadDate: Date;
    fromWebsite: boolean;
    folderId: string;
  }
  
  export interface CreateFile {
    name: string;
    description: string | null;
    content: Buffer;
    mimeType: string;
    fileType: string;
    fileSize: number;
    fromWebsite: boolean;
    folderId: string;
  }

  export interface FolderFile {
    id: string;
    name: string;
    description: string | null;
    uploadDate: Date;
    fileType: string;
    fileSize: number;
    fromWebsite: boolean;
  }
  
  export interface FormattedFolderFile {
    id: string;
    name: string;
    description: string | null;
    fileType: string;
    fileSize: number;
    folder: string;
    fromWebsite: boolean;
  }