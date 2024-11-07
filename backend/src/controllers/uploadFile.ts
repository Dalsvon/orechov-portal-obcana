import { Request, Response, NextFunction } from 'express';
import prisma from '../database/prisma';
import path from 'path';


const formatDate = (date: Date): string => {
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
};

const getShortFileType = (mimeType: string, originalFilename: string): string => {
  const mimeTypeMap: { [key: string]: string } = {
    'application/pdf': 'pdf',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/vnd.ms-excel': 'xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    'application/vnd.ms-powerpoint': 'ppt',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'text/plain': 'txt',
  };

  if (mimeType in mimeTypeMap) {
    return mimeTypeMap[mimeType];
  }

  const extension = path.extname(originalFilename).toLowerCase().slice(1);
  if (extension) {
    return extension;
  }

  return mimeType.split('/')[1] || mimeType.split('/')[0];
};

const uploadFile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'Nebyl vybrán žádný soubor' });
      return;
    }

    const { originalname, buffer, mimetype, size } = req.file;
    const { name, description, folder } = req.body;

    if (!name || !folder) {
      res.status(400).json({ error: 'Název a složka jsou povinné' });
      return;
    }

    const existingFolder = await prisma.folder.findUnique({
      where: { name: folder }
    });

    if (!existingFolder) {
      res.status(404).json({ error: 'Vybraná složka neexistuje' });
      return;
    }

    const existingFile = await prisma.file.findFirst({
      where: {
        name,
        folderId: existingFolder.id
      }
    });

    if (existingFile) {
      res.status(409).json({ 
        error: 'Soubor s tímto názvem již ve složce existuje' 
      });
      return;
    }

    const newFile = await prisma.file.create({
      data: {
        name,
        description,
        content: buffer,
        mimeType: mimetype,
        fileType: getShortFileType(mimetype, originalname),
        fileSize: size,
        fromWebsite: false,
        folderId: existingFolder.id
      }
    });

    res.status(200).json({
      message: 'Soubor byl úspěšně nahrán',
      id: newFile.id,
      name: newFile.name,
      description: newFile.description,
      uploadDate: formatDate(newFile.uploadDate),
      fileType: newFile.fileType,
      fileSize: newFile.fileSize,
      folder
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Při nahrávání souboru došlo k chybě. Zkuste to prosím později' });
  }
};

export default uploadFile;