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