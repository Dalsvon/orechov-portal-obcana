import { RequestHandler } from 'express';
import { FileRepository } from '../repositories/file';
import { FolderRepository } from '../repositories/folder';
import prisma from '../database/prisma';

const fileRepository = new FileRepository(prisma);
const folderRepository = new FolderRepository(prisma);

// Removes a file from folder and from database
const deleteFile: RequestHandler = async (req, res, next) => {
  try {
    const { folder, id } = req.params;

    if (!folder || !id) {
      res.status(400).json({ 
        error: 'Chybí identifikátor složky nebo souboru.' 
      });
      return;
    }

    const existingFolder = await folderRepository.findByName(folder);

    if (!existingFolder) {
      res.status(404).json({ 
        error: 'Složka nebyla nalezena.' 
      });
      return;
    }

    const file = await fileRepository.findByIdInFolder(id, existingFolder.id);

    if (!file) {
      res.status(404).json({ 
        error: 'Soubor nebyl nalezen ve složce.' 
      });
      return;
    }

    await fileRepository.delete(id);

    res.status(200).json({ 
      message: 'Soubor byl úspěšně smazán.',
      deletedFileId: id 
    });
  } catch (error) {
    console.error('Error during file deletion:', error);
    next(error);
  }
};

export default deleteFile;