import { RequestHandler } from 'express';
import { FolderRepository } from '../repositories/folder';
import prisma from '../database/prisma';
import { FolderBasicInfo } from '../types/folderTypes';

const folderRepository = new FolderRepository(prisma);

// Returns all existing folders
const getFolders: RequestHandler = async (req, res) => {
  try {
    const folders = await folderRepository.findAllWithCounts();
    
    const formattedFolders: FolderBasicInfo[] = folders.map(folder => ({
      name: folder.name,
      fileCount: folder._count.files
    }));

    res.json(formattedFolders);
  } catch (error) {
    res.status(500).json({ 
      error: 'Nepodařilo se načíst složky. Zkuste to prosím později' 
    });
  }
};

export default getFolders;