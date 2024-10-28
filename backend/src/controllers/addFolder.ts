/*import { RequestHandler } from 'express';
import { db } from '../database/serverConfig';

const addFolder: RequestHandler = async (req, res, next) => {
  try {
    const { folderName } = req.body;

    if (!folderName) {
      res.status(400).json({ error: 'Folder name is required' });
      return;
    }

    // Check if the folder already exists
    const folderRef = db.ref(`documents/${folderName}`);
    const snapshot = await folderRef.once('value');

    if (snapshot.exists()) {
      res.status(409).json({ error: 'Folder already exists' });
      return;
    }

    // Create the new folder
    await folderRef.set(true);

    res.status(201).json({ message: 'Folder created successfully', folderName });
  } catch (error) {
    next(error);
  }
};*/

import { RequestHandler } from 'express';
import prisma from '../database/prisma';

const addFolder: RequestHandler = async (req, res, next) => {
  try {
    const { folderName } = req.body;

    if (!folderName) {
      res.status(400).json({ error: 'Folder name is required' });
      return;
    }

    // Check if folder already exists
    const existingFolder = await prisma.folder.findUnique({
      where: { name: folderName }
    });

    if (existingFolder) {
      res.status(409).json({ error: 'Folder already exists' });
      return;
    }

    // Create new folder
    const folder = await prisma.folder.create({
      data: { name: folderName }
    });

    res.status(201).json({ message: 'Folder created successfully', folderName });
  } catch (error) {
    next(error);
  }
};

export default addFolder;