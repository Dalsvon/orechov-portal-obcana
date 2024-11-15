import { RequestHandler } from 'express';
import { FolderRepository } from '../repositories/folder';
import prisma from '../database/prisma';

const FOLDER_NAME_MAX_LENGTH = 100;
const folderRepository = new FolderRepository(prisma);

// Adds a new folder for storing files if folder with given name doesn't exist already.
const addFolder: RequestHandler = async (req, res) => {
  try {
    const { folderName } = req.body;

    if (!folderName || typeof folderName !== 'string') {
      res.status(400).json({ error: 'Zadejte platný název složky.' });
      return;
    }

    const sanitizedFolderName = folderName.trim();

    if (sanitizedFolderName.length === 0) {
      res.status(400).json({ error: 'Název složky nemůže být prázdný.' });
      return;
    }

    if (sanitizedFolderName.length > FOLDER_NAME_MAX_LENGTH) {
      res.status(400).json({ 
        error: `Název složky nemůže být delší než ${FOLDER_NAME_MAX_LENGTH} znaků.` 
      });
      return;
    }

    const existingFolder = await folderRepository.findByName(sanitizedFolderName);

    if (existingFolder) {
      res.status(409).json({ error: 'Složka s tímto názvem již existuje.' });
      return;
    }

    const folder = await folderRepository.create(sanitizedFolderName);

    res.status(201).json({ 
      message: 'Složka byla vytvořena', 
      folderName: folder.name 
    });
  } catch (error) {
    console.error('Unexpected error in addFolder:', error);
    res.status(500).json({ 
      error: 'Nepodařilo se vytvořit složku. Prosím zkuste to znovu.' 
    });
  }
};

export default addFolder;