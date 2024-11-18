import { RequestHandler } from 'express';
import { ContactRepository } from '../repositories/contact';
import prisma from '../database/prisma';
import { Contact } from '../types/contactTypes';

const contactRepository = new ContactRepository(prisma);

// Returns contact for municipality
const getContact: RequestHandler = async (req, res): Promise<void> => {
  try {
    const contact: (Contact | null) = await contactRepository.findFirst();

    if (!contact) {
      res.status(404).json({ 
        error: 'Kontaktní informace nejsou k dispozici' 
      });
      return;
    }

    res.json(contact);
  } catch (error) {
    res.status(500).json({ 
      error: 'Nepodařilo se načíst kontaktní informace. Zkuste to prosím později' 
    });
  }
};

export default getContact;