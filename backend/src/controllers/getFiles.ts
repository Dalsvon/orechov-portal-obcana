import { RequestHandler } from 'express';
import { FolderRepository } from '../repositories/folder';
import prisma from '../database/prisma';
import { FormattedFolderFile } from '../types/folderTypes';

const folderRepository = new FolderRepository(prisma);

const getFiles: RequestHandler = async (req, res) => {
try {
    const { folderName } = req.params;

    if (!folderName) {
        res.status(400).json({ error: 'Chybí název složky.' });
        return;
    }
    const folder = await folderRepository.findByName(folderName);
    
    if (!folder) {
      res.status(404).json({ error: 'Složka nebyla nalezena.' });
      return;
    }

    const formattedFiles: FormattedFolderFile[] = folder.files.map(file => ({
      id: file.id,
      name: file.name,
      description: file.description,
      fileType: file.fileType,
      fileSize: file.fileSize,
      folder: folder.name,
      fromWebsite: file.fromWebsite
    }));

    res.json(formattedFiles);
  } catch (error) {
    res.status(500).json({ 
      error: 'Nepodařilo se načíst soubory. Zkuste to prosím později.' 
    });
  }
};

export default getFiles;