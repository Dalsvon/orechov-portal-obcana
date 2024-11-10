import { RequestHandler } from 'express';
import { FolderRepository } from '../repositories/folder';
import prisma from '../database/prisma';
import { FormattedFolder } from '../types/folder.types';

const folderRepository = new FolderRepository(prisma);

// Returns all existing folders and their files
const getFolders: RequestHandler = async (req, res) => {
  try {
    const folders = await folderRepository.findAll();
    
    const formattedFolders: FormattedFolder[] = folders.map(folder => ({
      name: folder.name,
      files: folder.files.map(file => ({
        id: file.id,
        name: file.name,
        description: file.description,
        uploadDate: file.uploadDate.toISOString(),
        fileType: file.fileType,
        fileSize: file.fileSize,
        folder: folder.name
      })),
    }));

    res.json(formattedFolders);
  } catch (error) {
    console.error('Error during getting folders from database:', error);
    res.status(500).json({ 
      error: 'Nepodařilo se načíst složky. Zkuste to prosím později.' 
    });
  }
};

export default getFolders;