import express from 'express';
import cors from 'cors';
import multer from 'multer';
import rateLimit from 'express-rate-limit';
import uploadFile from './controllers/uploadFile';
import downloadFile from './controllers/downloadFile';
import getFolders from './controllers/getFolders';
import deleteFile from './controllers/deleteFile';
import addFolder from './controllers/addFolder';
import deleteFolder from './controllers/deleteFolder';
import moveFile from './controllers/moveFile';
import getContact from './controllers/getContact';
import getFiles from './controllers/getFiles'
import authRouter, { sessionMiddleware, isAuthenticated } from './auth/auth';
import { securityHeaders } from './middleware/securityHeaders';
import initializeSystem from './initialization/initializeSystem';

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  //origin: 'http://192.168.1.179:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie', 'Content-Disposition']
}));

app.use(sessionMiddleware);
app.use(securityHeaders);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Limits upload size for all files 
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 200 * 1024 * 1024, // 200MB limit
  },
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests
});

app.use(limiter);

// Error handling middleware
const errorHandler: express.ErrorRequestHandler = (err, req, res, next) => {
  res.status(500).json({ error: 'Nastala neočekávaná chyba na strane serveru' });
};

// Router for authentication functions
app.use('/api/auth', authRouter);

// Routes
app.post('/api/folders', isAuthenticated, addFolder);
app.post('/api/file/upload', isAuthenticated, upload.single('file'), uploadFile);
app.delete('/api/file/:folder/:id', isAuthenticated, deleteFile);
app.delete('/api/folders/:folderName', isAuthenticated, deleteFolder);
app.post('/api/files/move', isAuthenticated, moveFile);

app.get('/api/file/:folder/:id/download', downloadFile); 
app.get('/api/folders/:folderName/files', getFiles);
app.get('/api/folders', getFolders);
app.get('/api/contact', getContact);

app.use(errorHandler);

const PORT = process.env.PORT || 3001;


initializeSystem().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});