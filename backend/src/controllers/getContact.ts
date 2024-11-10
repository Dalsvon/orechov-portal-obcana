import { RequestHandler } from 'express';
import { ContactRepository } from '../repositories/contact';
import prisma from '../database/prisma';
import { Contact, FormattedContact } from '../types/contact.types';

const contactRepository = new ContactRepository(prisma);

const formatContact = (contact: Contact): FormattedContact => ({
  name: contact.name,
  address: contact.address,
  phone: contact.phone,
  mobile: contact.mobile,
  email: contact.email,
  maintenence: contact.maintenence,
  dataId: contact.data_id,
  ic: contact.ic,
  dic: contact.dic,
  bankAccount: contact.bank_account,
  lastUpdated: contact.last_updated.toISOString(),
  officeHours: contact.officeHours,
  employees: contact.employees
});

// Returns contacts for municipality
const getContact: RequestHandler = async (req, res): Promise<void> => {
  try {
    const contact = await contactRepository.findFirst();

    if (!contact) {
      res.status(404).json({ 
        error: 'Kontaktní informace nejsou k dispozici' 
      });
      return;
    }

    const formattedContact = formatContact(contact);
    res.json(formattedContact);
  } catch (error) {
    console.error('Error during getting contact information from database:', error);
    res.status(500).json({ 
      error: 'Nepodařilo se načíst kontaktní informace. Zkuste to prosím později.' 
    });
  }
};

export default getContact;