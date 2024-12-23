import { FileRepository } from '../repositories/file';
import { FolderRepository } from '../repositories/folder';
import prisma from '../database/prisma';
import { RequestHandler } from 'express';
import { checkLength, FILE_NAME_MAX_LENGTH, formatDate, getShortFileType } from '../services/filesServices';

const fileRepository = new FileRepository(prisma);
const folderRepository = new FolderRepository(prisma);

const uploadFile: RequestHandler = async (req, res): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'Nebyl vybrán žádný soubor' });
      return;
    }

    const { originalname, buffer, mimetype, size } = req.file;
    const { name, description, folder } = req.body;

    if (!name || !folder) {
      res.status(400).json({ message: 'Název a složka jsou povinné' });
      return;
    }

    if (!buffer || !mimetype || !size) {
      res.status(400).json({ message: 'Chybný formát souboru' });
      return;
    }

    if (checkLength(name)) {
      res.status(400).json({ 
        message: `Název složky nemůže být delší než ${FILE_NAME_MAX_LENGTH} znaků` 
      });
      return;
    }


    const existingFolder = await folderRepository.findByName(folder);

    if (!existingFolder) {
      res.status(404).json({ message: 'Vybraná složka neexistuje' });
      return;
    }

    const existingFile = await fileRepository.findByNameInFolder(name, existingFolder.name);

    if (existingFile) {
      res.status(409).json({ 
        message: 'Soubor s tímto názvem již ve složce existuje' 
      });
      return;
    }

    const fileType = getShortFileType(mimetype, originalname);

    await fileRepository.create({
      name,
      description,
      content: buffer,
      mimeType: mimetype,
      fileType,
      fileSize: size,
      fromWebsite: false,
      folderId: existingFolder.id
    });

    res.status(200).json({ message: 'File created successfully' , name: name });
  } catch (error) {
    res.status(500).json({ 
      message: 'Při nahrávání souboru došlo k chybě. Zkuste to prosím později' 
    });
  }
};

export default uploadFile;