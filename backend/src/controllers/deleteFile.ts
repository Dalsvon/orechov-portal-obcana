import { RequestHandler } from 'express';
import prisma from '../database/prisma';

// Removes a file from folder and from database
const deleteFile: RequestHandler = async (req, res, next) => {
  try {
    const { folder, id } = req.params;

    if (!folder || !id) {
      res.status(400).json({ error: 'Chybí identifikátor složky nebo souboru' });
      return;
    }

    const existingFolder = await prisma.folder.findUnique({
      where: { name: folder },
      include: { files: true }
    });

    if (!existingFolder) {
      res.status(404).json({ error: 'Složka nebyla nalezena' });
      return;
    }

    const file = await prisma.file.findFirst({
      where: {
        AND: [
          { id },
          { folderId: existingFolder.id }
        ]
      },
    });

    if (!file) {
      res.status(404).json({ error: 'Soubor nebyl nalezen' });
      return;
    }

    await prisma.file.delete({
      where: { id }
    });

    res.status(200).json({ 
      message: 'Soubor byl úspěšně smazán',
      deletedFileId: id 
    });
  } catch (error) {
    console.error('Error durning file deletion:', error);
    next(error);
  }
};

export default deleteFile;