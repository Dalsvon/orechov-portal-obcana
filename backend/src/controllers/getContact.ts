import { RequestHandler } from 'express';
import prisma from '../database/prisma';

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
      return;
    }

    res.json({
      ...contact,
      officeHours: contact.officeHours
    });
  } catch (error) {
    next(error);
  }
};

export default getContact;