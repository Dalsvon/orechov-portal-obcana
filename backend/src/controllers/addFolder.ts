import { RequestHandler } from 'express';
import prisma from '../database/prisma';

const FOLDER_NAME_MAX_LENGTH = 200;

// Adds a new folder for storing files if folder with given name doesn't exist already.
const addFolder: RequestHandler = async (req, res, next) => {
  try {
    const { folderName } = req.body;

    if (!folderName || typeof folderName !== 'string') {
      res.status(400).json({ error: 'Zadejte platný název složky' });
      return;
    }

    const sanitizedFolderName = folderName.trim();

    if (sanitizedFolderName.length === 0) {
      res.status(400).json({ error: 'Název složky nemůže být prázdný' });
      return;
    }

    if (sanitizedFolderName.length > FOLDER_NAME_MAX_LENGTH) {
      res.status(400).json({ 
        error: `Název složky nemůže být delší než ${FOLDER_NAME_MAX_LENGTH} znaků` 
      });
      return;
    }

    const existingFolder = await prisma.folder.findUnique({
      where: { name: sanitizedFolderName }
    });

    if (existingFolder) {
      res.status(409).json({ error: 'Složka s tímto názvem již existuje' });
      return;
    }

    await prisma.folder.create({
      data: { name: sanitizedFolderName }
    });

    res.status(201).json({ message: 'Složka byla vytvořena', folderName });
  } catch (error) {
    console.error('Unexpected error in addFolder:', error);
    res.status(500).json({ error: 'Nepodařilo se vytvořit složku. Prosím zkuste to znovu' });
  }
};

export default addFolder;