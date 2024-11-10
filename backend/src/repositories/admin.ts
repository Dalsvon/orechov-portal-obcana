import { PrismaClient } from '@prisma/client';
import { Admin } from '../types/auth.types';
import bcrypt from 'bcrypt';

// Handles admin repository access
export class AdminRepository {
  constructor(private prisma: PrismaClient) {}

  async findByUsername(username: string): Promise<Admin | null> {
    return this.prisma.admin.findUnique({
      where: { username }
    });
  }

  async findFirst(): Promise<Admin | null> {
    return this.prisma.admin.findFirst();
  }

  async create(username: string, password: string): Promise<Admin> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.prisma.admin.create({
      data: {
        username,
        password: hashedPassword
      }
    });
  }

  async updatePassword(id: string, newPassword: string): Promise<Admin> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return this.prisma.admin.update({
      where: { id },
      data: { 
        password: hashedPassword,
        updatedAt: new Date()
      }
    });
  }

  async verifyPassword(hashedPassword: string, plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}