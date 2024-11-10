import { AdminRepository } from '../repositories/admin';
import { ContactRepository } from '../repositories/contact';
import prisma from '../database/prisma';

// Initializes admin account and basic contact
export const initializeSystem = async (): Promise<void> => {
  const adminRepository = new AdminRepository(prisma);
  const contactRepository = new ContactRepository(prisma);

  try {
    // Initialize admin
    const adminExists = await adminRepository.findFirst();
    
    if (!adminExists) {
      const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD;

      if (!defaultPassword) {
        throw new Error('DEFAULT_ADMIN_PASSWORD environment variable must be set');
      }

      await adminRepository.create('admin', defaultPassword);
      console.log('Admin account initialized');
    }

    // Initialize contact
    const contactExists = await contactRepository.findFirst();

    if (!contactExists) {
      await contactRepository.create('Obec Ořechov');
      console.log('Contact initialized');
    }

  } catch (error) {
    console.error('Error during system initialization:', error);
    throw error;
  }
};