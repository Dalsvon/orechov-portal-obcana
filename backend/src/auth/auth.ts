import { Request, Response, NextFunction } from 'express';
import express from 'express';
import cookieSession from 'cookie-session';
import bcrypt from 'bcrypt';
import prisma from '../database/prisma';

interface LoginRequest {
  username: string;
  password: string;
}

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

interface AuthResponse {
  message?: string;
  error?: string;
}

declare module 'express' {
  interface Request {
    session: {
      isAdmin?: boolean;
      [key: string]: any;
    } | null;
  }
}

const router = express.Router();

export const sessionMiddleware = cookieSession({
  name: 'connect.sid',
  keys: [process.env.SESSION_SECRET || 'your-secret-key'],
  maxAge: 24 * 60 * 60 * 1000,
  secure: false,
  httpOnly: true,
  sameSite: 'lax',
  path: '/'
});

// Function to check if the user is authenticated for admin action
export const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
  if (req.session?.isAdmin) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// This function will always create a new admin accout if one doesn't exixt when backend is first run
export const initializeAdmin = async (): Promise<void> => {
  try {
    const adminExists = await prisma.admin.findFirst();
    
    if (!adminExists) {
      const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);
      
      await prisma.admin.create({
        data: {
          username: 'admin',
          password: hashedPassword
        }
      });
      
      console.log('Admin account initialized');
    }
  } catch (error) {
    console.error('Error initializing admin account:', error);
  }
};

// Login route
router.post(
  '/login',
  async (
    req: Request<{}, AuthResponse, LoginRequest>,
    res: Response<AuthResponse>
  ): Promise<void> => {
    try {
      const { username, password } = req.body;

      const admin = await prisma.admin.findUnique({
        where: { username }
      });

      if (!admin) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      const validPassword = await bcrypt.compare(password, admin.password);

      if (!validPassword) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      req.session = {
        isAdmin: true
      };
      
      res.json({ message: 'Logged in successfully' });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'An error occurred during login' });
    }
  }
);

// Logout route
router.post(
  '/logout',
  (req: Request, res: Response<AuthResponse>): void => {
    req.session = null as any;
    res.json({ message: 'Logged out successfully' });
  }
);

// Change password route
router.post(
  '/change-password',
  isAuthenticated,
  async (
    req: Request<{}, AuthResponse, ChangePasswordRequest>,
    res: Response<AuthResponse>
  ): Promise<void> => {
    try {
      const { currentPassword, newPassword } = req.body;

      const admin = await prisma.admin.findFirst();

      if (!admin) {
        res.status(404).json({ error: 'Admin account not used' });
        return;
      }

      const validPassword = await bcrypt.compare(currentPassword, admin.password);

      if (!validPassword) {
        res.status(401).json({ error: 'Zadané administrátorské heslo nie je správne.' });
        return;
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await prisma.admin.update({
        where: { id: admin.id },
        data: { 
          password: hashedPassword,
          updatedAt: new Date()
        }
      });

      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({ error: 'An error occurred while changing password' });
    }
  }
);

export default router;