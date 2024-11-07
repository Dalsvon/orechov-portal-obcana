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

// Validate required environment
const requiredEnvVars = ['SESSION_SECRET', 'DEFAULT_ADMIN_PASSWORD', 'NODE_ENV'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Pro produkční prostředí musí být nastavena proměnná ${envVar}`);
  }
}

const router = express.Router();

// Session to hold cookies for admin role
export const sessionMiddleware = cookieSession({
  name: 'session',
  keys: [process.env.SESSION_SECRET!],
  maxAge: 24 * 60 * 60 * 1000,
  secure: false, // set as "process.env.NODE_ENV === 'production'" for production
  httpOnly: true,
  sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  path: '/'
});

// Function to check if the user is authenticated for admin action
export const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.session) {
    res.status(401).json({ error: 'Relace vypršela' });
    return;
  }

  if (!req.session.isAdmin) {
    res.status(401).json({ error: 'Neoprávněný přístup' });
    return;
  }
  next();
};

// This function will always create a new admin accout if one doesn't exixt when backend is first run
export const initializeAdmin = async (): Promise<void> => {
  try {
    const adminExists = await prisma.admin.findFirst();
    
    if (!adminExists) {
      const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD;

      if (!defaultPassword) {
        throw new Error('DEFAULT_ADMIN_PASSWORD environment variable must be set in production');
      }

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
        res.status(401).json({ error: 'Neplatné přihlašovací údaje' });
        return;
      }

      const validPassword = await bcrypt.compare(password, admin.password);

      if (!validPassword) {
        res.status(401).json({ error: 'Neplatné přihlašovací údaje' });
        return;
      }

      req.session = {
        isAdmin: true
      };
      
      res.json({ message: 'Přihlášení bylo úspěšné' });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Při přihlašování došlo k chybě' });
    }
  }
);

// Logout route
router.post(
  '/logout',
  (req: Request, res: Response<AuthResponse>): void => {
    req.session = null;
    res.clearCookie('session');
    res.json({ message: 'Odhlášení bylo úspěšné' });
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

      if (!newPassword || newPassword.length < 12) {
        res.status(400).json({ 
          error: 'Nové heslo musí mít alespoň 12 znaků' 
        });
        return;
      }

      const admin = await prisma.admin.findFirst();

      if (!admin) {
        res.status(404).json({ error: 'Administrátorský účet nebyl nalezen' });
        return;
      }

      const validPassword = await bcrypt.compare(currentPassword, admin.password);

      if (!validPassword) {
        res.status(401).json({ error: 'Zadané administrátorské heslo není správné' });
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

      res.json({ message: 'Heslo bylo úspěšně změněno' });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({ error: 'Při změně hesla došlo k chybě' });
    }
  }
);

export default router;