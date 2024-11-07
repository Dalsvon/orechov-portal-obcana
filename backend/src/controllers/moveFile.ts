import { RequestHandler } from 'express';
import prisma from '../database/prisma';

const moveFile: RequestHandler = async (req, res, next) => {
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

    const sourcefolderRecord = await prisma.folder.findUnique({
      where: { 
        name: sourceFolder
      },
      include: {
        files: {
          where: { id: fileId },
          select: { id: true }
        }
      }
    });

    const targetFolderRecord = await prisma.folder.findUnique({
      where: { name: targetFolder }
    });

    if (!sourcefolderRecord || !targetFolderRecord) {
      res.status(404).json({ error: 'Zdrojová nebo cílová složka neexistuje' });
      return;
    }

    if (sourcefolderRecord.files.length === 0) {
      res.status(404).json({ 
        error: 'Soubor nebyl nalezen ve zdrojové složce' 
      });
      return;
    }

    await prisma.file.update({
      where: { id: fileId },
      data: { folderId: targetFolderRecord.id }
    });

    res.status(200).json({ message: 'File moved successfully' });
  } catch (error) {
    console.error('Error during file move:', error);
    res.status(500).json({ 
      error: 'Při přesunu souboru došlo k chybě. Zkuste to prosím později.' 
    });
  }
};

export default moveFile;
