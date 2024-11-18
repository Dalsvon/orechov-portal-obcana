import { FolderFile } from "./fileTypes";

  export interface Folder {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    files: FolderFile[];
  }

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