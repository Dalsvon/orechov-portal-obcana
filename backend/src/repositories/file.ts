import { PrismaClient } from '@prisma/client';
import { File, CreateFileRep } from '../types/file.types';

// Handles file repository access
export class FileRepository {
  constructor(private prisma: PrismaClient) {}

  async findByNameInFolder(name: string, folderId: string): Promise<File | null> {
    return this.prisma.file.findFirst({
      where: {
        name,
        folderId
      }
    });
  }

  async create(fileData: CreateFileRep): Promise<File> {
    return this.prisma.file.create({
      data: fileData
    });
  }

  async updateFolder(fileId: string, newFolderId: string): Promise<File> {
    return this.prisma.file.update({
      where: { id: fileId },
      data: { folderId: newFolderId }
    });
  }

  async findByIdAndFolderId(fileId: string, folderId: string): Promise<File | null> {
    return this.prisma.file.findFirst({
      where: {
        AND: [
          { id: fileId },
          { folderId }
        ]
      }
    });
  }

  async findByIdInFolder(id: string, folderName: string): Promise<File | null> {
    return this.prisma.file.findFirst({
      where: {
        id,
        folder: {
          name: folderName
        }
      }
    });
  }

  async delete(fileId: string): Promise<void> {
    await this.prisma.file.delete({
      where: { id: fileId }
    });
  }
}