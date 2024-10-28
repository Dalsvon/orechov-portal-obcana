/*import { Request, Response, NextFunction } from 'express';
import { db, bucket } from '../database/serverConfig';

const deleteFile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { folder, id } = req.params;

    // Reference to the specific file and folder in the database
    const fileRef = db.ref(`documents/${folder}/${id}`);
    const folderRef = db.ref(`documents/${folder}`);
    
    // Check if the file exists
    const fileSnapshot = await fileRef.once('value');
    if (!fileSnapshot.exists()) {
      res.status(404).json({ error: 'File not found' });
      return;
    }

    const fileData = fileSnapshot.val();

    // Delete the file from Storage if it exists
    if (fileData.url) {
      try {
        await bucket.file(fileData.url).delete();
      } catch (error) {
        console.error('Error deleting file from storage:', error);
        // Continue with database deletion even if storage deletion fails
      }
    }

    // Delete the specific file entry from the database
    await fileRef.remove();

    // Check if the folder still exists
    const folderSnapshot = await folderRef.once('value');
    if (!folderSnapshot.exists()) {
      // If the folder was removed, recreate it with a placeholder
      await folderRef.set(true);
    }

    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    next(error);
  }
};*/

import { RequestHandler } from 'express';
import prisma from '../database/prisma';

const deleteFile: RequestHandler = async (req, res, next) => {
  try {
    const { folder, id } = req.params;

    // Find the folder
    const existingFolder = await prisma.folder.findUnique({
      where: { name: folder },
      include: { files: true }
    });

    if (!existingFolder) {
      res.status(404).json({ error: 'Folder not found' });
      return;
    }

    // Find and delete the file
    const file = await prisma.file.findUnique({
      where: { id }
    });

    if (!file) {
      res.status(404).json({ error: 'File not found' });
      return;
    }

    // Delete from database
    await prisma.file.delete({
      where: { id }
    });

    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export default deleteFile;