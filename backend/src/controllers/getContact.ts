import { RequestHandler } from 'express';
import prisma from '../database/prisma';

// Returns contacts for municipality
const getContact: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const contact = await prisma.contact.findFirst({
      where: { id: 1 },
      include: {
        officeHours: {
          select: {
            id: true,
            days: true,
            time: true
          }
        },
        employees: {
          select: {
            id: true,
            name: true,
            position: true,
            phone: true,
            email: true
          }
        }
      }
    });

    if (!contact) {
      res.status(404).json({ 
        error: 'Kontaktní informace nejsou k dispozici' 
      });
      return;
    }

    const formattedContact = {
      id: contact.id,
      name: contact.name,
      address: contact.address,
      phone: contact.phone,
      mobile: contact.mobile,
      email: contact.email,
      maintenence: contact.maintenence,
      dataId: contact.dataId,
      ic: contact.ic,
      dic: contact.dic,
      bankAccount: contact.bankAccount,
      lastUpdated: contact.lastUpdated.toISOString(),
      officeHours: contact.officeHours,
      employees: contact.employees
    };

    res.json(formattedContact);
  } catch (error) {
    console.error('Error during getting contact information from database:', error);
    res.status(500).json({ 
      error: 'Nepodařilo se načíst kontaktní informace. Zkuste to prosím později.' 
    });
  }
};

export default getContact;