import { RequestHandler } from 'express';
import prisma from '../database/prisma';

// Adds a new folder for storing files if folder with given name doesn't exist already.
const addFolder: RequestHandler = async (req, res, next) => {
  try {
    const { folderName } = req.body;

    if (!folderName) {
      res.status(400).json({ error: 'Zadejte jmeno složky' });
      return;
    }

    const existingFolder = await prisma.folder.findUnique({
      where: { name: folderName }
    });

    if (existingFolder) {
      res.status(409).json({ error: 'Složka s tímto názvem již existuje' });
      return;
    }

    await prisma.folder.create({
      data: { name: folderName }
    });

    res.status(201).json({ message: 'Složka byla vytvořena', folderName });
  } catch (error) {
    next(error);
  }
};

export default addFolder;