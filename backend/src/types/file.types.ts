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
  
  export interface CreateFileDTO {
    name: string;
    description: string | null;
    content: Buffer;
    mimeType: string;
    fileType: string;
    fileSize: number;
    fromWebsite: boolean;
    folderId: string;
  }
  
  export interface UploadedFileResponse {
    id: string;
    name: string;
    description: string | null;
    uploadDate: string;
    fileType: string;
    fileSize: number;
    folder: string;
  }

  export interface MoveFileParams {
    fileId: string;
    sourceFolder: string;
    targetFolder: string;
  }

  export interface DeleteFileParams {
    folder: string;
    id: string;
  }

  
   export interface DownloadFileRequest {
    folder: string;
    id: string;
  }