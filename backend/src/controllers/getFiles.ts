import { RequestHandler } from 'express';
import { bucket, db, admin } from '../database/serverConfig';

interface PDF {
    id: string;
    name: string;
    description: string;
    url: string;
  }

  const getFiles: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const snapshot = await db.ref('documents').once('value');
      const pdfs = snapshot.val();
      const formattedPdfs: PDF[] = Object.entries(pdfs || {}).map(([id, pdf]) => ({
        id,
        ...(pdf as Omit<PDF, 'id'>)
      }));
      res.json(formattedPdfs);
    } catch (error) {
      next(error);
    }
  };

export default getFiles;