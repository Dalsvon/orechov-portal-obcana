/*import { RequestHandler } from 'express';
import { db } from '../database/serverConfig';

const getFolders: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const snapshot = await db.ref('documents').once('value');
    const documents = snapshot.val();
    
    if (!documents) {
      //return res.json([]);
      return;
    }

    const folders = Object.keys(documents).map(folder => ({
      name: folder,
      files: Object.entries(documents[folder] || {}).map(([id, file]) => ({
        id,
        ...(file as any),
      })),
    }));

    res.json(folders);
  } catch (error) {
    next(error);
  }
};*/

import { RequestHandler } from 'express';
import prisma from '../database/prisma';

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
        //url: file.url,
        uploadDate: file.uploadDate.toLocaleString(),
        fileType: file.fileType,
        fileSize: file.fileSize,
        folder: folder.name
      })),
    }));

    res.json(formattedFolders);
  } catch (error) {
    next(error);
  }
};

export default getFolders;