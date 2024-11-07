import { RequestHandler } from 'express';
import prisma from '../database/prisma';

// Removes folder from database if it exists and is empty
const deleteFolder: RequestHandler = async (req, res, next) => {
  try {
    const { folderName } = req.params;

    if (!folderName) {
      res.status(400).json({ error: 'Chybí název složky' });
      return;
    }

    const folder = await prisma.folder.findUnique({
      where: { name: folderName },
      include: { files: true }
    });

    if (!folder) {
      res.status(404).json({ error: 'Složka nebyla nalezena' });
      return;
    }

    if (folder.files.length > 0) {
      res.status(400).json({ error: 'Nelze smazat složku, která obsahuje soubory. Nejprve smažte nebo přesuňte všechny soubory.' });
      return;
    }

    await prisma.$transaction(async (tx) => {
      const fileCount = await tx.file.count({
        where: { folderId: folder.id }
      });

      if (fileCount > 0) {
        throw new Error('Nelze smazat složku, která obsahuje soubory. Nejprve smažte nebo přesuňte všechny soubory.');
      }

      // Delete the folder
      await tx.folder.delete({
        where: { id: folder.id }
      });
    });


    res.status(200).json({ message: 'Složka byla úspěšně smazána' });
  } catch (error) {
    console.error('Error during folder deletion:', error);
    next(error);
  }
};

export default deleteFolder;