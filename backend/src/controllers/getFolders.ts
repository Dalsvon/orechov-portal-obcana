import { RequestHandler } from 'express';
import prisma from '../database/prisma';

// Returns folders and their associated files
const getFolders: RequestHandler = async (req, res, next) => {
  try {
    const folders = await prisma.folder.findMany({
      include: {
        files: true,
      },
    });
    
    const formattedFolders = folders.map(folder => ({
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