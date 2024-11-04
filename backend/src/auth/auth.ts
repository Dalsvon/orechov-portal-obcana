import { Request, Response, NextFunction } from 'express';
import express from 'express';
import session from 'express-session';
import bcrypt from 'bcrypt';
import prisma from '../database/prisma';

// Define interfaces for request/response types
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

declare module 'express-session' {
  interface SessionData {
    isAdmin: boolean;
  }
}

const router = express.Router();

export const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    name: 'connect.sid', // Explicitly set the cookie name
    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: '/' // Ensure cookie is sent for all paths
    }
  });

export const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
    
    if (req.session.isAdmin) {
      next();
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  };

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

      req.session.isAdmin = true;
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
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({ error: 'Could not log out' });
        return;
      }
      res.json({ message: 'Logged out successfully' });
    });
  }
);

// Check auth status route
router.get(
  '/check-auth',
  (req: Request, res: Response<{ isAuthenticated: boolean }>): void => {
    res.json({ isAuthenticated: req.session.isAdmin === true });
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
        res.status(404).json({ error: 'Admin account not found' });
        return;
      }

      const validPassword = await bcrypt.compare(currentPassword, admin.password);

      if (!validPassword) {
        res.status(401).json({ error: 'Current password is incorrect' });
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