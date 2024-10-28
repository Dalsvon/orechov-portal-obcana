/*import { RequestHandler } from 'express';
import { db } from '../database/serverConfig';

const moveFile: RequestHandler = async (req, res, next) => {
  try {
    const { fileId, sourceFolder, targetFolder } = req.body;

    if (!fileId || !sourceFolder || !targetFolder) {
      res.status(400).json({ error: 'Missing required parameters' });
      return;
    }

    // Get the file data from the source folder
    const sourceRef = db.ref(`documents/${sourceFolder}/${fileId}`);
    const fileSnapshot = await sourceRef.once('value');
    
    if (!fileSnapshot.exists()) {
      res.status(404).json({ error: 'File not found' });
      return;
    }

    const fileData = fileSnapshot.val();

    // Add the file to the target folder
    const targetRef = db.ref(`documents/${targetFolder}/${fileId}`);
    await targetRef.set({
      ...fileData,
      folder: targetFolder
    });

    // Remove the file from the source folder
    await sourceRef.remove();

    res.status(200).json({ message: 'File moved successfully' });
  } catch (error) {
    next(error);
  }
};*/

import { RequestHandler } from 'express';
import prisma from '../database/prisma';

const moveFile: RequestHandler = async (req, res, next) => {
  try {
    const { fileId, sourceFolder, targetFolder } = req.body;

    // Find source folder
    const sourcefolderRecord = await prisma.folder.findUnique({
      where: { name: sourceFolder }
    });

    // Find target folder
    const targetFolderRecord = await prisma.folder.findUnique({
      where: { name: targetFolder }
    });

    if (!sourcefolderRecord || !targetFolderRecord) {
      res.status(404).json({ error: 'Source or target folder not found' });
      return;
    }

    // Update file's folder
    await prisma.file.update({
      where: { id: fileId },
      data: { folderId: targetFolderRecord.id }
    });

    res.status(200).json({ message: 'File moved successfully' });
  } catch (error) {
    next(error);
  }
};

export default moveFile;
