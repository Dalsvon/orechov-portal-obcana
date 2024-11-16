  export interface FolderWithCount {
    name: string;
    _count: {
        files: number;
    };
  }

  export interface FolderBasicInfo {
    name: string;
    fileCount: number;
  }
  
  
  export interface Folder {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    files: FolderFile[];
  }

  export interface FolderWithFileIds {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    files: { id: string }[];
  }

  export interface FolderName {
    name: string;
  }

  export interface FormattedFolder {
    name: string;
    files: FormattedFolderFile[];
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