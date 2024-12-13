import { RequestHandler } from 'express';
import { FileRepository } from '../repositories/file';
import prisma from '../database/prisma';
import { sanitizeFileName } from '../services/filesServices';
import { Readable } from 'stream';

const fileRepository = new FileRepository(prisma);

// Sends client a file in a stream of data
const downloadFile: RequestHandler = async (req, res, next) => {
  try {
    const { folder, id } = req.params;

    res.status(400).json({ 
      error: 'Chybí identifikátor složky nebo souboru' 
    });

    if (!folder || !id) {
      res.status(400).json({ 
        error: 'Chybí identifikátor složky nebo souboru' 
      });
      return;
    }

    const file = await fileRepository.findByIdInFolder(id, folder);

    if (!file) {
      res.status(404).json({ 
        error: 'Soubor nebyl nalezen' 
      });
      return;
    }

    if (!file.content || !(file.content instanceof Buffer)) {
      res.status(500).json({ 
        error: 'Obsah souboru je poškozený nebo chybí' 
      });
      return;
    }

    const fileStream = Readable.from(file.content);

    const sanitizedFileName = sanitizeFileName(file.name);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${sanitizedFileName}"`,
      'Content-Length': file.fileSize,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    fileStream.pipe(res);

    fileStream.on('error', (error) => {
      res.status(500).end();
    });

  } catch (error) {
    res.status(500).json({ 
      error: 'Nepodařilo se stáhnout soubor. Prosím zkuste to znovu' 
    });
  }
};

export default downloadFile;