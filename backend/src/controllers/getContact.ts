import { RequestHandler } from 'express';
import { ContactRepository } from '../repositories/contact';
import prisma from '../database/prisma';
import { formatContact } from '../utils/contactUtils';

const contactRepository = new ContactRepository(prisma);

// Returns contact for municipality
const getContact: RequestHandler = async (req, res): Promise<void> => {
  try {
    const contact = await contactRepository.findFirst();

    if (!contact) {
      res.status(404).json({ 
        error: 'Kontaktní informace nejsou k dispozici.' 
      });
      return;
    }

    const formattedContact = formatContact(contact);
    res.json(formattedContact);
  } catch (error) {
    res.status(500).json({ 
      error: 'Nepodařilo se načíst kontaktní informace. Zkuste to prosím později.' 
    });
  }
};

export default getContact;