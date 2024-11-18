import { RequestHandler } from 'express';
import { FileRepository } from '../repositories/file';
import { FolderRepository } from '../repositories/folder';
import prisma from '../database/prisma';
import { doesFileExistInFolder } from '../services/filesServices';

const fileRepository = new FileRepository(prisma);
const folderRepository = new FolderRepository(prisma);

// Moves a file between two folders
const moveFile: RequestHandler = async (req, res) => {
  try {
    const { fileId, sourceFolder, targetFolder } = req.body;

    if (!fileId || !sourceFolder || !targetFolder) {
      res.status(400).json({ 
        error: 'Chybí potřebné údaje pro přesun souboru' 
      });
      return;
    }

    if (sourceFolder === targetFolder) {
      res.status(400).json({ 
        error: 'Soubor je již v této složce' 
      });
      return;
    }

    const sourcefolderRecord = await folderRepository.findByNameWithFileIds(sourceFolder);
    const targetFolderRecord = await folderRepository.findByNameWithFileIds(targetFolder);

    if (!sourcefolderRecord || !targetFolderRecord) {
      res.status(404).json({ 
        error: 'Zdrojová nebo cílová složka neexistuje' 
      });
      return;
    }

    if (!doesFileExistInFolder(sourcefolderRecord, fileId)) {
      res.status(404).json({ 
        error: 'Soubor nebyl nalezen ve zdrojové složce' 
      });
      return;
    }

    await fileRepository.updateFolder(fileId, targetFolderRecord.id);

    res.status(200).json({ message: 'File moved successfully' });
  } catch (error) {
    res.status(500).json({ 
      error: 'Při přesunu souboru došlo k chybě. Zkuste to prosím později' 
    });
  }
};

export default moveFile;