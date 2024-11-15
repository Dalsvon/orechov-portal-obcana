import { FileRepository } from '../repositories/file';
import { FolderRepository } from '../repositories/folder';
import prisma from '../database/prisma';
import { getShortFileType, formatDate } from '../utils/fileutils';
import { RequestHandler } from 'express';

const fileRepository = new FileRepository(prisma);
const folderRepository = new FolderRepository(prisma);
const FILE_NAME_MAX_LENGTH = 100;

const uploadFile: RequestHandler = async (req, res): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'Nebyl vybrán žádný soubor.' });
      return;
    }

    const { originalname, buffer, mimetype, size } = req.file;
    const { name, description, folder } = req.body;

    if (!name || !folder) {
      res.status(400).json({ message: 'Název a složka jsou povinné.' });
      return;
    }

    if (name.length > FILE_NAME_MAX_LENGTH) {
      res.status(400).json({ 
        message: `Název složky nemůže být delší než ${FILE_NAME_MAX_LENGTH} znaků.` 
      });
      return;
    }


    const existingFolder = await folderRepository.findByName(folder);

    if (!existingFolder) {
      res.status(404).json({ message: 'Vybraná složka neexistuje.' });
      return;
    }

    const existingFile = await fileRepository.findByNameInFolder(name, existingFolder.id);

    if (existingFile) {
      res.status(409).json({ 
        message: 'Soubor s tímto názvem již ve složce existuje.' 
      });
      return;
    }

    const fileType = getShortFileType(mimetype, originalname);

    const newFile = await fileRepository.create({
      name,
      description,
      content: buffer,
      mimeType: mimetype,
      fileType,
      fileSize: size,
      fromWebsite: false,
      folderId: existingFolder.id
    });

    res.status(200).json({
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
    res.status(500).json({ 
      message: 'Při nahrávání souboru došlo k chybě. Zkuste to prosím později' 
    });
  }
};

export default uploadFile;