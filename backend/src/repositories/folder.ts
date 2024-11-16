import { PrismaClient } from '@prisma/client';
import { Folder, FolderName, FolderWithFileIds, FolderWithCount } from '../types/folderTypes';

// Handles repository access for folders
export class FolderRepository {
  constructor(private prisma: PrismaClient) {}

  async findByName(name: string): Promise<Folder | null> {
    return this.prisma.folder.findUnique({
      where: { name },
      include: { files: true }
    });
  }

  async findByNameWithFileIds(name: string): Promise<FolderWithFileIds | null> {
    return this.prisma.folder.findUnique({
      where: { name },
      include: {
        files: {
          select: { id: true }
        }
      }
    });
  }

  async create(name: string): Promise<FolderName> {
    return this.prisma.folder.create({
      data: { name }
    });
  }

  async findAllWithCounts(): Promise<FolderWithCount[]> {
    return this.prisma.folder.findMany({
        select: {
            name: true,
            _count: {
                select: {
                    files: true
                }
            }
        }
    });
 } 

  async delete(id: string): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const fileCount = await tx.file.count({
        where: { folderId: id }
      });

      if (fileCount > 0) {
        throw new Error('Nelze smazat složku, která obsahuje soubory. Nejprve smažte nebo přesuňte všechny soubory.');
      }

      await tx.folder.delete({
        where: { id }
      });
    });
  }
}