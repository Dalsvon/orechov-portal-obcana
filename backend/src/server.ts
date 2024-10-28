import express from 'express';
import cors from 'cors';
import multer from 'multer';
import uploadFile from './controllers/uploadFile';
import downloadFile from './controllers/downloadFile';
import getFolders from './controllers/getFolders';
import deleteFile from './controllers/deleteFile';
import addFolder from './controllers/addFolder';
import deleteFolder from './controllers/deleteFolder';
import moveFile from './controllers/moveFile';
import getContact from './controllers/getContact';
import authRouter, { sessionMiddleware, initializeAdmin, isAuthenticated } from './auth/auth';

const app = express();

// Configure CORS to handle binary data
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'], // Added Cookie explicitly
  exposedHeaders: ['Set-Cookie', 'Content-Disposition'] // Added Set-Cookie explicitly
}));

app.use(sessionMiddleware);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 200 * 1024 * 1024, // 200MB limit
  },
});

// Error handling middleware
const errorHandler: express.ErrorRequestHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'An unexpected error occurred' });
};

app.use('/api/auth', authRouter);

// Routes
app.post('/api/folders', isAuthenticated, addFolder);
app.post('/api/pdfs/upload', isAuthenticated, upload.single('pdf'), uploadFile);
app.delete('/api/pdfs/:folder/:id', isAuthenticated, deleteFile);
app.delete('/api/folders/:folderName', isAuthenticated, deleteFolder);
app.post('/api/files/move', isAuthenticated, moveFile);

app.get('/api/pdfs/:folder/:id/download', downloadFile); 
app.get('/api/folders', getFolders);
app.get('/api/contact', getContact);

app.use(errorHandler);

const PORT = process.env.PORT || 3001;


initializeAdmin().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

function cookieParser(): any {
  throw new Error('Function not implemented.');
}
