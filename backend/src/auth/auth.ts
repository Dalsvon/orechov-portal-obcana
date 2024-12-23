import { Request, Response, NextFunction } from 'express';
import express from 'express';
import cookieSession from 'cookie-session';
import { AdminRepository } from '../repositories/admin';
import prisma from '../database/prisma';
import { LoginRequest, ChangePasswordRequest, AuthResponse, AuthResponseCheck } from '../types/authTypes';
import { verifyPassword } from '../services/authServices';

declare module 'express' {
  interface Request {
    session: {
      isAdmin?: boolean;
      username?: string;
      [key: string]: any;
    } | null;
  }
}

// Validate required environment
const requiredEnvVars = ['SESSION_SECRET', 'DEFAULT_ADMIN_PASSWORD', 'NODE_ENV'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`For production the enviromental constant ${envVar} must be set`);
  }
}

const adminRepository = new AdminRepository(prisma);
const router = express.Router();

// Session to hold cookies for admin role
export const sessionMiddleware = cookieSession({
  name: 'session',
  keys: [process.env.SESSION_SECRET!],
  maxAge: 8 * 60 * 60 * 1000,
  secure: true,
  httpOnly: true,
  sameSite: 'lax'
});

// Function to check if the user is authenticated for admin action
export const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
  console.log('Session:', req.session);
  console.log('Cookies:', req.cookies);

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

// Login route
router.post(
  '/login',
  async (
    req: Request<{}, AuthResponse, LoginRequest>,
    res: Response<AuthResponse>
  ): Promise<void> => {
    try {
      const { username, password } = req.body;

      const admin = await adminRepository.findByUsername(username);

      if (!admin) {
        res.status(401).json({ error: 'Neplatné přihlašovací údaje' });
        return;
      }

      const validPassword = await verifyPassword(admin.password, password);

      if (!validPassword) {
        res.status(401).json({ error: 'Neplatné přihlašovací údaje' });
        return;
      }

      req.session = {
        isAdmin: true,
        username: admin.username
      };
      
      res.json({ message: 'Přihlášení bylo úspěšné' });
    } catch (error) {
      res.status(500).json({ error: 'Při přihlašování došlo k chybě. Skuste znovu' });
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

      const admin = await adminRepository.findByUsername(req.session?.username != undefined ? req.session.username : "");

      if (!admin) {
        res.status(404).json({ error: 'Administrátorský účet nebyl nalezen' });
        return;
      }

      const validPassword = await verifyPassword(
        admin.password,
        currentPassword
      );

      if (!validPassword) {
        res.status(401).json({ error: 'Zadané administrátorské heslo není správné' });
        return;
      }

      await adminRepository.updatePassword(admin.id, newPassword);

      res.json({ message: 'Heslo bylo úspěšně změněno' });
    } catch (error) {
      res.status(500).json({ error: 'Při změně hesla došlo k chybě. Heslo nebylo změněno' });
    }
  }
);

// Checks admin status for refreshes and returning to the website
router.get(
  '/check-auth',
  (req: Request, res: Response<AuthResponseCheck>): void => {
    if (!req.session) {
      res.status(401).json({ 
        error: 'Relace vypršela',
        isAuthenticated: false 
      });
      return;
    }

    res.json({ 
      message: 'Administrátorský status byl skontrolován',
      isAuthenticated: !!req.session.isAdmin 
    });
  }
);

export default router;
