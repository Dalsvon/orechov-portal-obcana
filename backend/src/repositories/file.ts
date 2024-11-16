import { PrismaClient } from '@prisma/client';
import { File, CreateFile } from '../types/fileTypes';

// Handles file repository access
export class FileRepository {
  constructor(private prisma: PrismaClient) {}

  async findByNameInFolder(name: string, folderName: string): Promise<File | null> {
    return this.prisma.file.findFirst({
      where: {
        name,
        folder: {
          name: folderName
        }
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

  async create(fileData: CreateFile): Promise<File> {
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

  async delete(fileId: string): Promise<void> {
    await this.prisma.file.delete({
      where: { id: fileId }
    });
  }
}