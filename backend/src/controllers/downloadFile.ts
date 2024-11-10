import { RequestHandler } from 'express';
import { FileRepository } from '../repositories/file';
import prisma from '../database/prisma';
import { sanitizeFileName } from '../utils/fileutils';
import { DownloadFileRequest } from '../types/file.types'

const fileRepository = new FileRepository(prisma);

// Sends client a file in a form of Buffer
const downloadFile: RequestHandler<DownloadFileRequest> = async (req, res, next) => {
  try {
    const { folder, id } = req.params;

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

    const sanitizedFileName = sanitizeFileName(file.name);

    res.setHeader('Content-Type', file.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${sanitizedFileName}"`);
    res.setHeader('Content-Length', file.fileSize);

    res.send(file.content);
  } catch (error) {
    console.error('Error downloading file:', error);
    next(error);
  }
};

export default downloadFile;