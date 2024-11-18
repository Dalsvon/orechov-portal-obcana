import { RequestHandler } from 'express';
import { FolderRepository } from '../repositories/folder';
import prisma from '../database/prisma';

const folderRepository = new FolderRepository(prisma);

// Removes a folder from database if it exists and is empty.
const deleteFolder: RequestHandler = async (req, res) => {
  try {
    const { folderName } = req.params;

    if (!folderName) {
      res.status(400).json({ error: 'Chybí název složky' });
      return;
    }

    const folder = await folderRepository.findByName(folderName);

    if (!folder) {
      res.status(404).json({ error: 'Složka nebyla nalezena' });
      return;
    }

    if (folder.files.length > 0) {
      res.status(400).json({ 
        error: 'Nelze smazat složku, která obsahuje soubory. Nejprve smažte nebo přesuňte všechny soubory' 
      });
      return;
    }

    await folderRepository.delete(folder.id);

    res.status(200).json({ message: 'Složka byla úspěšně smazána', deletedFolderId: folder.id });
  } catch (error) {
    res.status(500).json({ 
      error: 'Nepodařilo se smazat složku. Prosím zkuste to znovu' 
    });
  }
};

export default deleteFolder;