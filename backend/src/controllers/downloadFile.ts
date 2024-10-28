/*import { RequestHandler } from 'express';
import { bucket, db } from '../database/serverConfig';

const downloadFile: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const { folder, id } = req.params;

    const snapshot = await db.ref(`documents/${folder}/${id}`).once('value');
    const fileData = snapshot.val();

    if (!fileData || !fileData.url) {
      res.status(404).json({ error: 'File not found' });
      return;
    }

    const [signedUrl] = await bucket.file(fileData.url).getSignedUrl({
      action: 'read',
      expires: Date.now() + 15 * 60 * 1000, // URL expires in 15 minutes
    });

    res.json({ downloadUrl: signedUrl });
  } catch (error) {
    console.error('Error generating download URL:', error);
    res.status(500).json({ error: 'Failed to generate download URL' });
  }
};

*/

import { RequestHandler } from 'express';
import prisma from '../database/prisma';

const downloadFile: RequestHandler = async (req, res, next) => {
  try {
    const { folder, id } = req.params;

    // Find the file with folder verification
    const file = await prisma.file.findFirst({
      where: {
        id,
        folder: {
          name: folder
        }
      }
    });

    if (!file) {
      res.status(404).json({ error: 'File not found' });
      return;
    }

    // Convert Buffer to Uint8Array if necessary
    const fileBuffer = file.content instanceof Buffer 
      ? file.content 
      : Buffer.from(file.content);

    // Set response headers
    res.setHeader('Content-Type', file.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(file.name)}"`);
    res.setHeader('Content-Length', file.fileSize);

    // Send the file directly as a buffer
    res.send(fileBuffer);
  } catch (error) {
    console.error('Error downloading file:', error);
    next(error);
  }
};

export default downloadFile;