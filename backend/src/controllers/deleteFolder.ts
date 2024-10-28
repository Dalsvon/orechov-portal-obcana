/*import { Request, Response, NextFunction } from 'express';
import { db } from '../database/serverConfig';

const deleteFolder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { folderName } = req.params;

    // Reference to the folder in the database
    const folderRef = db.ref(`documents/${folderName}`);
    
    // Check if the folder exists
    const folderSnapshot = await folderRef.once('value');
    if (!folderSnapshot.exists()) {
      res.status(404).json({ error: 'Folder not found' });
      return;
    }

    const folderData = folderSnapshot.val();

    // Check if the folder is empty (contains no files)
    if (folderData && Object.keys(folderData).length > 0) {
      res.status(400).json({ error: 'Cannot delete non-empty folder' });
      return;
    }

    // Delete the folder
    await folderRef.remove();

    res.status(200).json({ message: 'Folder deleted successfully' });
  } catch (error) {
    next(error);
  }
};*/

import { RequestHandler } from 'express';
import prisma from '../database/prisma';

const deleteFolder: RequestHandler = async (req, res, next) => {
  try {
    const { folderName } = req.params;

    // Check if folder exists
    const folder = await prisma.folder.findUnique({
      where: { name: folderName },
      include: { files: true }
    });

    if (!folder) {
      res.status(404).json({ error: 'Folder not found' });
      return;
    }

    if (folder.files.length > 0) {
      res.status(400).json({ error: 'Cannot delete non-empty folder' });
      return;
    }

    // Delete folder
    await prisma.folder.delete({
      where: { name: folderName }
    });

    res.status(200).json({ message: 'Folder deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export default deleteFolder;