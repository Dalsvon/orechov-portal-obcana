import { RequestHandler } from 'express';
import prisma from '../database/prisma';

// Sends client a file in a form of Buffer
const downloadFile: RequestHandler = async (req, res, next) => {
  try {
    const { folder, id } = req.params;

    if (!folder || !id) {
      res.status(400).json({ 
        error: 'Chybí identifikátor složky nebo souboru' 
      });
      return;
    }

    const file = await prisma.file.findFirst({
      where: {
        id,
        folder: {
          name: folder
        }
      }
    });

    if (!file) {
      res.status(404).json({ 
        error: 'Soubor nebyl nalezen' 
      });
      return;
    }

    const sanitizedFileName = encodeURIComponent(file.name)
      .replace(/['()]/g, escape)
      .replace(/\*/g, '_');

    if (!file.content || !(file.content instanceof Buffer)) {
      res.status(500).json({ 
        error: 'Obsah souboru je poškozený nebo chybí' 
      });
      return;
    }

    res.setHeader('Content-Type', file.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(sanitizedFileName)}"`);
    res.setHeader('Content-Length', file.fileSize);

    res.send(file.content);
  } catch (error) {
    console.error('Error downloading file:', error);
    next(error);
  }
};

export default downloadFile;