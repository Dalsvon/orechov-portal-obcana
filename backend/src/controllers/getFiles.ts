import { RequestHandler } from 'express';
import { FolderRepository } from '../repositories/folder';
import prisma from '../database/prisma';
import { formatFolderFile } from '../services/filesServices';
import { FormattedFolderFile } from '../types/fileTypes';

const folderRepository = new FolderRepository(prisma);

// Return all files of a folder
const getFiles: RequestHandler = async (req, res) => {
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

    const formattedFiles : FormattedFolderFile [] = formatFolderFile(folder.files, folder.name);

    res.json(formattedFiles);
  } catch (error) {
    res.status(500).json({ 
      error: 'Nepodařilo se načíst soubory. Zkuste to prosím později' 
    });
  }
};

export default getFiles;