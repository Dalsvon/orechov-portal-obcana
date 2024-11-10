  export interface Folder {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    files: FolderFile[];
  }

  export interface FolderName {
    name: string;
  }

  export interface FolderFile {
    id: string;
    name: string;
    description: string | null;
    uploadDate: Date;
    fileType: string;
    fileSize: number;
  }

  export interface FolderWithFileIds {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    files: { id: string }[];
  }
  
  export interface FormattedFolder {
    name: string;
    files: FormattedFolderFile[];
  }
  
  export interface FormattedFolderFile {
    id: string;
    name: string;
    description: string | null;
    uploadDate: string;
    fileType: string;
    fileSize: number;
    folder: string;
  }