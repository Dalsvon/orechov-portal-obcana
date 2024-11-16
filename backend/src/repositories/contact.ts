import { PrismaClient } from '@prisma/client';
import { Contact } from '../types/contactTypes';

// Handles contact repository access
export class ContactRepository {
  constructor(private prisma: PrismaClient) {}

  async findFirst(): Promise<Contact | null> {
    return this.prisma.contact.findFirst({
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
  }

  async create(name: string): Promise<Contact> {
    return this.prisma.contact.create({
      data: {
        name,
        last_updated: new Date(),
        officeHours: {
          create: []
        },
        employees: {
          create: []
        }
      },
      include: {
        officeHours: true,
        employees: true
      }
    });
  }
}